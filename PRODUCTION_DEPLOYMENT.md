# Production Deployment Checklist

## Environment Configuration

Before deploying to production, ensure the following environment variables are properly configured in your `.env` file:

### Security Settings
- **APP_DEBUG=false** - CRITICAL: Disable debug mode in production to prevent exposing stack traces and sensitive information
- **APP_ENV=production** - Set environment to production
- **APP_KEY** - Generate a unique application key using `php artisan key:generate`

### Database
- Set appropriate `DB_*` variables for your production database
- Ensure database backups are configured

### Session & Cache
- Configure `SESSION_DRIVER` (files, database, redis, etc.)
- Configure `CACHE_DRIVER` (file, redis, etc.)
- For production, use database or redis instead of file-based drivers

### Email
- Configure `MAIL_*` variables for production email service
- Set proper from address and credentials

### Security Best Practices
1. Never commit `.env` file to version control
2. Use environment variables from your hosting provider to set sensitive values
3. Keep Laravel and dependencies updated with security patches
4. Run `php artisan optimize` for production deployment
5. Run `php artisan config:cache` to cache configuration
6. Ensure logs directory is writable but outside web root
7. Set appropriate file permissions (700 for directories, 600 for files)

### Database Migrations
- Run `php artisan migrate --force` in production
- Test migrations in staging environment first

### Assets
- Run `npm run build` to compile assets
- Set `MIX_ASSET_URL` if assets are served from a CDN

### Backup Configuration
- Ensure backup directory is outside web root
- Set up automated backup schedule
- Test backup restoration process

## Verification

After deployment, verify:
- [ ] APP_DEBUG is false
- [ ] Error pages don't expose sensitive information
- [ ] All critical dependencies are installed
- [ ] Database is properly migrated
- [ ] Log files are being created properly
- [ ] Static assets are loading correctly
