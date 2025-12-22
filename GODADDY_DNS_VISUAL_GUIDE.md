# GoDaddy DNS Setup - Visual Guide

## Step-by-Step: Configure DNS for growplantgrow.com

### Step 1: Log In to GoDaddy

1. Go to: **https://dcc.godaddy.com**
2. Click **"Sign In"** (top right)
3. Enter your GoDaddy credentials

### Step 2: Find Your Domain

1. After logging in, you'll see **"My Products"** or **"Domains"**
2. Look for **growplantgrow.com**
3. **Click on the domain name** (not the checkbox)

### Step 3: Access DNS Management

1. You'll see domain details page
2. Scroll down to find **"DNS"** section
3. Look for a button that says:
   - **"Manage DNS"** OR
   - **"DNS"** OR
   - **"DNS Management"**
4. **Click that button**

### Step 4: View Current DNS Records

You'll see a table with DNS records. It might look like:

| Type | Name | Value | TTL | Actions |
|------|------|-------|-----|---------|
| A | @ | 50.63.202.xxx | 600 | ✏️ 🗑️ |
| CNAME | www | @ | 600 | ✏️ 🗑️ |
| MX | @ | mail.growplantgrow.com | 3600 | ✏️ 🗑️ |
| TXT | @ | v=spf1... | 3600 | ✏️ 🗑️ |

### Step 5: Update A Record (Root Domain)

**Find the A record with Name: `@`**

**Option A: Edit Existing Record**
1. Click the **pencil icon** ✏️ next to the A record
2. A popup or form will appear
3. Find **"Points to"** or **"Value"** field
4. **Replace the IP** with your CloudCone VPS IP
5. **TTL**: Keep as `600` or change to `600`
6. Click **"Save"** or **"Update"**

**Option B: Create New Record (if no A record exists)**
1. Click **"Add"** button (usually at top of table)
2. Select **Type**: `A`
3. **Name**: `@` (or leave blank)
4. **Value/Points to**: `YOUR_CLOUDCONE_IP`
5. **TTL**: `600`
6. Click **"Save"**

### Step 6: Update CNAME Record (www)

**Find the CNAME record with Name: `www`**

**Option A: Edit Existing Record**
1. Click the **pencil icon** ✏️ next to the CNAME record
2. Find **"Points to"** or **"Value"** field
3. **Change it to**: `growplantgrow.com`
4. **TTL**: `600`
5. Click **"Save"**

**Option B: Create New Record (if no CNAME exists)**
1. Click **"Add"** button
2. Select **Type**: `CNAME`
3. **Name**: `www`
4. **Value/Points to**: `growplantgrow.com`
5. **TTL**: `600`
6. Click **"Save"**

### Step 7: Verify Your Records

After updating, your DNS should look like:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| **A** | **@** | **YOUR_CLOUDCONE_IP** | **600** |
| **CNAME** | **www** | **growplantgrow.com** | **600** |

**Important:**
- The A record points `@` (root domain) to your CloudCone IP
- The CNAME record points `www` to `growplantgrow.com`

### Step 8: Save Changes

- Changes are usually saved automatically
- If there's a **"Save"** button at the bottom, click it
- You might see a confirmation message

### Step 9: Wait for DNS Propagation

**DNS changes take time to propagate worldwide:**

- **Usually**: 1-2 hours
- **Maximum**: 24-48 hours
- **Check status**: https://www.whatsmydns.net/#A/growplantgrow.com

**What to look for:**
- Green checkmarks = DNS propagated ✅
- Red X's = Still propagating ⏳
- When all locations show your CloudCone IP, you're ready!

### Step 10: Test Your Domain

Once DNS has propagated:

1. **Visit**: http://growplantgrow.com
2. **Visit**: http://www.growplantgrow.com
3. Both should show your site (or Nginx default page if SSL not set up yet)

---

## Common GoDaddy DNS Interface Locations

### Interface Type 1: Classic View
- DNS records in a table
- Edit buttons on the right
- "Add" button at top

### Interface Type 2: Modern View
- Cards/tiles for each record
- Edit button on each card
- "+ Add Record" button

### Interface Type 3: Advanced View
- Dropdown menus
- Form-based editing
- "Save" button at bottom

**All interfaces work the same way - just find the edit button!**

---

## What Your CloudCone IP Looks Like

Your CloudCone IP will be something like:
- `192.168.1.100` (example)
- `45.76.123.45` (example)
- `104.248.xxx.xxx` (example)

**Find it in CloudCone dashboard:**
1. Go to your VPS
2. Look for **"IP Address"** or **"IPv4"**
3. Copy that exact IP address

---

## Troubleshooting GoDaddy DNS

### Can't Find DNS Management
- Look for tabs: "DNS", "Nameservers", "Records"
- Try clicking directly on domain name (not checkbox)
- Check if you need to unlock domain first

### Changes Not Saving
- Make sure you clicked "Save" button
- Check for error messages
- Try refreshing page and checking again

### Wrong IP Address
- Double-check CloudCone dashboard for correct IP
- Make sure you copied the entire IP (4 numbers separated by dots)
- No spaces before or after

### DNS Not Propagating
- Wait longer (can take up to 48 hours)
- Clear your browser cache
- Try accessing from different network/device
- Check: https://www.whatsmydns.net

---

## Quick Reference

**A Record:**
- Type: `A`
- Name: `@`
- Value: `YOUR_CLOUDCONE_IP`
- TTL: `600`

**CNAME Record:**
- Type: `CNAME`
- Name: `www`
- Value: `growplantgrow.com`
- TTL: `600`

---

**Once DNS is configured, proceed to SSL setup in the main deployment guide!**

