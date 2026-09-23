$ErrorActionPreference = 'Stop'

$projectRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$inputPath = Join-Path $projectRoot 'PROJECT_RUNDOWN_AND_DATA_FLOW.md'
$rtfPath = Join-Path $projectRoot 'PROJECT_RUNDOWN_AND_DATA_FLOW.rtf'
$docPath = Join-Path $projectRoot 'PROJECT_RUNDOWN_AND_DATA_FLOW.doc'

if (-not (Test-Path $inputPath)) {
    throw "Markdown source not found: $inputPath"
}

function Escape-Rtf {
    param([string]$Text)

    if ($null -eq $Text) {
        return ''
    }

    $escaped = $Text.Replace('\', '\\').Replace('{', '\{').Replace('}', '\}')
    $builder = New-Object System.Text.StringBuilder

    foreach ($char in $escaped.ToCharArray()) {
        $code = [int][char]$char

        if ($code -le 127) {
            [void]$builder.Append($char)
        }
        else {
            [void]$builder.Append("\u$code?")
        }
    }

    return $builder.ToString()
}

function Add-RtfParagraph {
    param(
        [Parameter(Mandatory = $true)][System.Text.StringBuilder]$Builder,
        [Parameter(Mandatory = $true)][AllowEmptyString()][string]$Text,
        [string]$Control = '\pard\sa120\fs22\f0 ',
        [switch]$BlankLine
    )

    if ($BlankLine) {
        [void]$Builder.AppendLine('\pard\sa120\fs22\f0 \par')
        return
    }

    [void]$Builder.AppendLine("$Control$(Escape-Rtf $Text)\par")
}

$builder = New-Object System.Text.StringBuilder
[void]$builder.AppendLine('{\rtf1\ansi\deff0')
[void]$builder.AppendLine('{\fonttbl{\f0 Calibri;}{\f1 Consolas;}}')
[void]$builder.AppendLine('\viewkind4\uc1')

$lines = Get-Content $inputPath
$inCodeBlock = $false
$tableBuffer = New-Object System.Collections.Generic.List[string]

foreach ($line in $lines) {
    if ($line -match '^```') {
        if ($tableBuffer.Count -gt 0) {
            foreach ($row in $tableBuffer) {
                if ($row -match '^\|\s*[-:| ]+\|$') {
                    continue
                }

                $cells = $row.Trim().Trim('|').Split('|') | ForEach-Object { $_.Trim() }
                Add-RtfParagraph -Builder $builder -Text ($cells -join '    ') -Control '\pard\sa60\fs18\f1 '
            }

            Add-RtfParagraph -Builder $builder -Text '' -BlankLine
            $tableBuffer.Clear()
        }

        $inCodeBlock = -not $inCodeBlock
        continue
    }

    if ($inCodeBlock) {
        Add-RtfParagraph -Builder $builder -Text $line -Control '\pard\sa0\fs18\f1 '
        continue
    }

    if ($line -match '^\|.*\|$') {
        $tableBuffer.Add($line)
        continue
    }

    if ($tableBuffer.Count -gt 0) {
        foreach ($row in $tableBuffer) {
            if ($row -match '^\|\s*[-:| ]+\|$') {
                continue
            }

            $cells = $row.Trim().Trim('|').Split('|') | ForEach-Object { $_.Trim() }
            Add-RtfParagraph -Builder $builder -Text ($cells -join '    ') -Control '\pard\sa60\fs18\f1 '
        }

        Add-RtfParagraph -Builder $builder -Text '' -BlankLine
        $tableBuffer.Clear()
    }

    if ([string]::IsNullOrWhiteSpace($line)) {
        Add-RtfParagraph -Builder $builder -Text '' -BlankLine
        continue
    }

    if ($line -match '^\s*---+\s*$') {
        continue
    }

    if ($line -match '^(#{1,6})\s+(.*)$') {
        $level = $matches[1].Length
        $text = $matches[2].Trim()

        switch ($level) {
            1 { Add-RtfParagraph -Builder $builder -Text $text -Control '\pard\sa180\qc\b\fs36\f0 ' }
            2 { Add-RtfParagraph -Builder $builder -Text $text -Control '\pard\sa140\b\fs28\f0 ' }
            default { Add-RtfParagraph -Builder $builder -Text $text -Control '\pard\sa120\b\fs24\f0 ' }
        }

        continue
    }

    if ($line -match '^\-\s+(.*)$') {
        Add-RtfParagraph -Builder $builder -Text ('- ' + $matches[1]) -Control '\pard\li360\sa60\fs22\f0 '
        continue
    }

    if ($line -match '^\d+\.\s+.*$') {
        Add-RtfParagraph -Builder $builder -Text $line.Trim() -Control '\pard\li360\sa60\fs22\f0 '
        continue
    }

    Add-RtfParagraph -Builder $builder -Text $line.Trim() -Control '\pard\sa120\fs22\f0 '
}

if ($tableBuffer.Count -gt 0) {
    foreach ($row in $tableBuffer) {
        if ($row -match '^\|\s*[-:| ]+\|$') {
            continue
        }

        $cells = $row.Trim().Trim('|').Split('|') | ForEach-Object { $_.Trim() }
        Add-RtfParagraph -Builder $builder -Text ($cells -join '    ') -Control '\pard\sa60\fs18\f1 '
    }

    Add-RtfParagraph -Builder $builder -Text '' -BlankLine
}

[void]$builder.AppendLine('}')

$content = $builder.ToString()
Set-Content -Path $rtfPath -Value $content -Encoding ASCII
Set-Content -Path $docPath -Value $content -Encoding ASCII

Write-Output "Created:"
Write-Output $rtfPath
Write-Output $docPath
