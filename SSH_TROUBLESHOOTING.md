# SSH Access Troubleshooting for CloudCone

## Common SSH Issues

### Issue: "Permission denied, please try again"

This usually means:
1. Wrong password
2. SSH key authentication required (password disabled)
3. Wrong username
4. SSH service not running

---

## Solutions

### Solution 1: Use CloudCone Web Console (Easiest)

**No SSH needed!**

1. **Go to**: https://app.cloudcone.com
2. **Log in** to your account
3. **Click "VPS"** → Select your server (ep-core)
4. **Click "Console"** button
5. **Web-based terminal opens** - no SSH needed!

This is the easiest way to access your server.

---

### Solution 2: Check SSH Credentials

**Get correct credentials from CloudCone:**

1. **In CloudCone dashboard**:
   - Go to your VPS (ep-core)
   - Look for **"SSH Access"** or **"Access Details"**
   - Note:
     - **Username** (usually `root` or `ubuntu`)
     - **Password** (or SSH key)
     - **Port** (usually `22`)

2. **Try connecting with correct username**:
   ```bash
   # If username is 'root'
   ssh root@74.48.140.120
   
   # If username is 'ubuntu'
   ssh ubuntu@74.48.140.120
   ```

3. **Enter password when prompted**

---

### Solution 3: Reset Root Password

**If you forgot the password:**

1. **In CloudCone dashboard**:
   - Go to your VPS
   - Look for **"Reset Password"** or **"Change Password"**
   - Click it
   - Set a new password
   - Wait a few minutes for it to take effect

2. **Try connecting again**:
   ```bash
   ssh root@74.48.140.120
   ```

---

### Solution 4: Use SSH Key (More Secure)

**If password authentication is disabled:**

1. **Generate SSH key** (on your Windows machine):
   ```bash
   ssh-keygen -t rsa -b 4096
   # Press Enter for default location
   # Press Enter for no passphrase (or set one)
   ```

2. **Copy public key**:
   ```bash
   cat ~/.ssh/id_rsa.pub
   # Copy the output
   ```

3. **Add to CloudCone**:
   - In CloudCone dashboard → VPS → SSH Keys
   - Add your public key

4. **Connect with key**:
   ```bash
   ssh -i ~/.ssh/id_rsa root@74.48.140.120
   ```

---

### Solution 5: Check SSH Port

**Some servers use non-standard ports:**

1. **Check CloudCone dashboard** for SSH port
2. **Connect with port specified**:
   ```bash
   ssh -p 2222 root@74.48.140.120
   # Replace 2222 with actual port
   ```

---

## Recommended: Use CloudCone Web Console

**Easiest method - no SSH setup needed:**

1. Go to https://app.cloudcone.com
2. Log in
3. VPS → ep-core → **"Console"** button
4. Web terminal opens
5. Run all commands there!

---

## Alternative: Use CloudCone VNC

**If Console doesn't work:**

1. In CloudCone dashboard → VPS → **"VNC"**
2. Opens browser-based desktop access
3. Can open terminal from there

---

## Quick Test

**Try these in order:**

1. **Web Console** (easiest):
   - CloudCone dashboard → Console button

2. **SSH with root**:
   ```bash
   ssh root@74.48.140.120
   ```

3. **SSH with ubuntu**:
   ```bash
   ssh ubuntu@74.48.140.120
   ```

4. **Check CloudCone for correct credentials**:
   - Dashboard → VPS → Access Details

---

## Once Connected

**After you get access, run:**

```bash
# Check current setup
pm2 list
ls /var/www/

# Deploy growplantgrow
mkdir -p /var/www/growplantgrow
cd /var/www/growplantgrow
git clone https://github.com/letsgrababyte/growplantgrow.git .
```

---

**Which method would you like to try first?**
1. CloudCone Web Console (recommended)
2. Reset password in CloudCone
3. Check SSH credentials in dashboard

Let me know what you see in the CloudCone dashboard, and I'll help you get connected!

