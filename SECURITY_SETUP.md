# Security & Compliance Setup for GrowPlantGrow.com

## Security Measures to Implement

### 1. Rate Limiting

**Install and configure rate limiting:**

```bash
# On CloudCone VPS
apt install nginx-module-ratelimit -y
```

**Add to Nginx config** (`/etc/nginx/sites-available/growplantgrow.com`):

```nginx
# Rate limiting zones
limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/m;
limit_req_zone $binary_remote_addr zone=api:10m rate=20r/s;

server {
    # ... existing config ...
    
    # General rate limiting
    limit_req zone=general burst=20 nodelay;
    
    # Stricter for auth endpoints
    location /signin {
        limit_req zone=auth burst=3 nodelay;
        proxy_pass http://localhost:3000;
        # ... proxy settings ...
    }
    
    location /signup {
        limit_req zone=auth burst=3 nodelay;
        proxy_pass http://localhost:3000;
        # ... proxy settings ...
    }
    
    # API rate limiting
    location /api {
        limit_req zone=api burst=30 nodelay;
        proxy_pass http://localhost:3000;
        # ... proxy settings ...
    }
}
```

### 2. Fail2Ban (Brute Force Protection)

```bash
# Install Fail2Ban
apt install fail2ban -y

# Create config for Nginx
nano /etc/fail2ban/jail.local
```

**Add configuration:**
```ini
[nginx-limit-req]
enabled = true
port = http,https
filter = nginx-limit-req
logpath = /var/log/nginx/error.log
maxretry = 10
findtime = 600
bantime = 3600

[nginx-botsearch]
enabled = true
port = http,https
filter = nginx-botsearch
logpath = /var/log/nginx/access.log
maxretry = 2
findtime = 600
bantime = 86400
```

### 3. Security Headers

**Add to Nginx config:**

```nginx
server {
    # ... existing config ...
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;" always;
    
    # Hide Nginx version
    server_tokens off;
}
```

### 4. Logging & Monitoring

**Set up centralized logging:**

```bash
# Install log rotation
apt install logrotate -y

# Create log rotation config
nano /etc/logrotate.d/growplantgrow
```

**Add:**
```
/var/www/growplantgrow/.next/*.log {
    daily
    rotate 7
    compress
    delaycompress
    notifempty
    create 0640 root root
    sharedscripts
}
```

**PM2 logging:**
```bash
# Configure PM2 logging
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### 5. Admin Action Logging

**Already implemented in database:**
- `ai_agent_logs` table tracks AI actions
- Can extend to log all admin actions

**Add admin action logging:**

```typescript
// src/lib/admin/audit.ts
export async function logAdminAction(
  userId: string,
  action: string,
  details: any
) {
  const supabase = await createClient();
  await supabase.from('admin_audit_logs').insert({
    user_id: userId,
    action,
    details,
    ip_address: details.ip,
    user_agent: details.userAgent,
  });
}
```

### 6. Input Validation

**Already using:**
- TypeScript for type safety
- Supabase RLS for database security
- Next.js built-in XSS protection

**Additional measures:**
- Zod schema validation (can add)
- Sanitize user inputs
- Validate file uploads

### 7. Environment Security

**Secure environment variables:**

```bash
# Set proper permissions
chmod 600 /var/www/growplantgrow/.env.production
chown root:root /var/www/growplantgrow/.env.production
```

### 8. Firewall Rules

**Already configured, but enhance:**

```bash
# Only allow necessary ports
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw enable
```

### 9. Regular Updates

**Set up automatic security updates:**

```bash
# Install unattended-upgrades
apt install unattended-upgrades -y

# Configure
dpkg-reconfigure -plow unattended-upgrades
```

### 10. Database Security

**Supabase already provides:**
- Row Level Security (RLS) ✅
- Encrypted connections ✅
- Audit logs ✅

**Additional measures:**
- Regular backups
- Monitor for suspicious queries
- Review RLS policies regularly

---

## Compliance Considerations

### GDPR (if serving EU users)

1. **Privacy Policy** - Already have `/policies` page
2. **Data Export** - Users can request their data
3. **Data Deletion** - Users can delete accounts
4. **Cookie Consent** - May need cookie banner

### PCI DSS (if processing payments)

- Use Lemon Squeezy (handles PCI compliance) ✅
- Never store credit card data
- Use HTTPS everywhere ✅

### BPH (Best Practices for Hosting)

1. **Input Validation** ✅
2. **Output Encoding** ✅
3. **Authentication** ✅
4. **Authorization** ✅
5. **Session Management** ✅
6. **Error Handling** ✅
7. **Logging** ✅
8. **Monitoring** (to implement)

---

## Monitoring Setup

### Application Monitoring

**PM2 Monitoring:**
```bash
pm2 install pm2-server-monit
```

**Uptime Monitoring:**
- Set up external service (UptimeRobot, Pingdom)
- Monitor https://growplantgrow.com
- Alert on downtime

### Log Monitoring

**Set up log aggregation:**
- Use PM2 logs
- Nginx access logs
- Supabase logs
- Consider: ELK stack, Grafana, or cloud service

---

## Next Steps

1. **Implement rate limiting** (Nginx config)
2. **Set up Fail2Ban** (brute force protection)
3. **Add security headers** (Nginx)
4. **Configure logging** (PM2, Nginx)
5. **Set up monitoring** (uptime, logs)
6. **Regular security audits** (monthly)

**Would you like me to:**
- Create the security configuration files?
- Set up monitoring?
- Implement specific compliance features?

