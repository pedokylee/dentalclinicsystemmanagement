# Scripts Directory

This directory contains utility scripts for testing, verification, and maintenance of the Dental Clinic System.

## Folder Structure

### `/testing`
Test and setup scripts for creating sample data and testing functionality.
- `create_test_appointments.php` - Create test appointments for today
- `create_notifications.php` - Create test notifications for patients
- Other testing scripts

### `/verification`
Scripts for verifying system functionality and data integrity.
- `verify_backup_system.php` - Verify backup system is working
- `verify_exports.php` - Verify export functionality
- `final_verification.php` - Final system verification
- `check_syntax.php` - Check PHP syntax

### `/maintenance`
Maintenance and debugging scripts.
- `check_appointments.php` - Check appointments in database
- `check_notifications.php` - Check notifications in database
- `system_audit.php` - System audit script
- `debug_backup.php` - Debug backup issues

## Running Scripts

To run any script from the project root:

```bash
php scripts/testing/create_test_appointments.php
php scripts/verification/verify_backup_system.php
php scripts/maintenance/check_appointments.php
```

## Best Practices

- Do not modify scripts in production
- Always test changes in a development environment first
- Backup the database before running maintenance scripts
- Check logs after running system audits

## Automated Jobs & Observers

The application includes automated background jobs and model observers:

### Jobs (`/app/Jobs`)
- `SendAppointmentReminderJob` - Sends appointment reminders to patients
- `NotifyAppointmentConfirmedJob` - Notifies when appointments are confirmed

### Observers (`/app/Observers`)
- `AppointmentObserver` - Automatically triggers notifications and reminders for appointment events
