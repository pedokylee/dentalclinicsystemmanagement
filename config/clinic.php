<?php

return [
    // Clinic operating hours (24-hour format)
    'hours' => [
        'open' => 9,     // 9 AM
        'close' => 17,   // 5 PM
    ],

    // Appointment time slot interval (in minutes)
    'slot_interval' => 30,

    // Valid procedure types
    'procedures' => [
        'extraction',
        'filling',
        'crown',
        'root_canal',
        'cleaning',
        'whitening',
    ],
];
