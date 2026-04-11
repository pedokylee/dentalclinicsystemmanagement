<?php

namespace App\Helpers;

class ClinicHelper
{
    /**
     * Generate available time slots for appointment booking
     * 
     * @return array Array of time slots in H:i format
     */
    public static function generateTimeSlots()
    {
        $config = config('clinic');
        $openHour = $config['hours']['open'];
        $closeHour = $config['hours']['close'];
        $interval = $config['slot_interval'];

        $timeSlots = [];
        
        for ($hour = $openHour; $hour < $closeHour; $hour++) {
            for ($minute = 0; $minute < 60; $minute += $interval) {
                $timeSlots[] = sprintf('%02d:%02d', $hour, $minute);
            }
        }

        return $timeSlots;
    }
}
