$ErrorActionPreference = 'Stop'

$projectRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$inputPath = Join-Path $projectRoot 'PROJECT_RUNDOWN_AND_DATA_FLOW.md'
$docxPath = Join-Path $projectRoot 'PROJECT_RUNDOWN_AND_DATA_FLOW.docx'
$pdfPath = Join-Path $projectRoot 'PROJECT_RUNDOWN_AND_DATA_FLOW.pdf'

if (-not (Test-Path $inputPath)) {
    throw "Markdown source not found: $inputPath"
}

function Add-Paragraph {
    param(
        [Parameter(Mandatory = $true)][object]$Selection,
        [Parameter(Mandatory = $true)][string]$Text,
        [string]$Style = 'Normal',
        [string]$FontName = 'Calibri',
        [int]$FontSize = 11,
        [int]$SpaceAfter = 6,
        [int]$Alignment = 0,
        [switch]$Bold
    )

    $Selection.Style = $Style
    $Selection.Font.Name = $FontName
    $Selection.Font.Size = $FontSize
    $Selection.Font.Bold = [int]$Bold.IsPresent
    $Selection.ParagraphFormat.Alignment = $Alignment
    $Selection.ParagraphFormat.SpaceAfter = $SpaceAfter
    $Selection.TypeText($Text)
    $Selection.TypeParagraph()
    $Selection.Font.Bold = 0
}

function Add-CodeParagraph {
    param(
        [Parameter(Mandatory = $true)][object]$Selection,
        [Parameter(Mandatory = $true)][string]$Text
    )

    Add-Paragraph -Selection $Selection -Text $Text -Style 'No Spacing' -FontName 'Consolas' -FontSize 9 -SpaceAfter 0
}

function Add-BulletParagraph {
    param(
        [Parameter(Mandatory = $true)][object]$Selection,
        [Parameter(Mandatory = $true)][string]$Text
    )

    Add-Paragraph -Selection $Selection -Text ("• " + $Text) -Style 'Normal' -SpaceAfter 2
}

function Add-NumberParagraph {
    param(
        [Parameter(Mandatory = $true)][object]$Selection,
        [Parameter(Mandatory = $true)][string]$Text
    )

    Add-Paragraph -Selection $Selection -Text $Text -Style 'Normal' -SpaceAfter 2
}

function Add-TableBlock {
    param(
        [Parameter(Mandatory = $true)][object]$Selection,
        [Parameter(Mandatory = $true)][string[]]$Rows
    )

    $usableRows = @()

    foreach ($row in $Rows) {
        if ($row -match '^\|\s*[-:| ]+\|$') {
            continue
        }

        $cells = $row.Trim().Trim('|').Split('|') | ForEach-Object { $_.Trim() }
        $usableRows += ,@($cells)
    }

    if ($usableRows.Count -eq 0) {
        return
    }

    foreach ($row in $usableRows) {
        Add-CodeParagraph -Selection $Selection -Text (($row -join "    ").Trim())
    }

    $Selection.TypeParagraph()
}

$lines = Get-Content $inputPath

$word = $null
$doc = $null

try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $word.DisplayAlerts = 0

    $doc = $word.Documents.Add()
    $selection = $word.Selection

    $selection.Font.Name = 'Calibri'
    $selection.Font.Size = 11

    $inCodeBlock = $false
    $tableBuffer = New-Object System.Collections.Generic.List[string]

    foreach ($line in $lines) {
        if ($line -match '^```') {
            if ($tableBuffer.Count -gt 0) {
                Add-TableBlock -Selection $selection -Rows $tableBuffer.ToArray()
                $tableBuffer.Clear()
            }

            $inCodeBlock = -not $inCodeBlock
            continue
        }

        if ($inCodeBlock) {
            Add-CodeParagraph -Selection $selection -Text $line
            continue
        }

        if ($line -match '^\|.*\|$') {
            $tableBuffer.Add($line)
            continue
        }

        if ($tableBuffer.Count -gt 0) {
            Add-TableBlock -Selection $selection -Rows $tableBuffer.ToArray()
            $tableBuffer.Clear()
        }

        if ([string]::IsNullOrWhiteSpace($line)) {
            $selection.TypeParagraph()
            continue
        }

        if ($line -match '^\s*---+\s*$') {
            continue
        }

        if ($line -match '^(#{1,6})\s+(.*)$') {
            $level = $matches[1].Length
            $text = $matches[2].Trim()

            if ($level -eq 1) {
                Add-Paragraph -Selection $selection -Text $text -Style 'Title' -FontName 'Calibri' -FontSize 20 -SpaceAfter 12
            } elseif ($level -eq 2) {
                Add-Paragraph -Selection $selection -Text $text -Style 'Heading 1' -FontName 'Calibri' -FontSize 16 -SpaceAfter 6
            } else {
                Add-Paragraph -Selection $selection -Text $text -Style 'Heading 2' -FontName 'Calibri' -FontSize 13 -SpaceAfter 4
            }

            continue
        }

        if ($line -match '^\-\s+(.*)$') {
            Add-BulletParagraph -Selection $selection -Text $matches[1]
            continue
        }

        if ($line -match '^\d+\.\s+.*$') {
            Add-NumberParagraph -Selection $selection -Text $line.Trim()
            continue
        }

        Add-Paragraph -Selection $selection -Text $line.Trim() -Style 'Normal' -SpaceAfter 6
    }

    if ($tableBuffer.Count -gt 0) {
        Add-TableBlock -Selection $selection -Rows $tableBuffer.ToArray()
        $tableBuffer.Clear()
    }

    $doc.SaveAs([ref]$docxPath, [ref]16)
    $doc.ExportAsFixedFormat($pdfPath, 17)
    $doc.Close()
    $word.Quit()

    Write-Output "Created:"
    Write-Output $docxPath
    Write-Output $pdfPath
}
finally {
    if ($doc -ne $null) {
        try { $doc.Close() } catch {}
    }

    if ($word -ne $null) {
        try { $word.Quit() } catch {}
    }
}
