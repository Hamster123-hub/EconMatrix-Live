# Econ Matrix - Peak Hosting VPS Deployment Guide

Server Details:
- **Server IP**: `82.25.180.33`
- **User**: `root`
- **Default Port**: `3000` (Nginx proxies `80` & `443` to `3000`)
- **Domain**: `econmatrix.lk` (and `www.econmatrix.lk`)

---

## 1. Domain DNS Configuration (Registrar)
In your domain registrar dashboard (where you registered `econmatrix.lk`):

| Type | Name / Host | Target / Value | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `@` | `82.25.180.33` | Automatic / 300s |
| **A** | `www` | `82.25.180.33` | Automatic / 300s |
| **A** | `server1` | `82.25.180.33` | Automatic / 300s |

---

## 2. Connect to Server via SSH
From Windows PowerShell, Command Prompt, or Mac/Linux Terminal:
```bash
ssh root@82.25.180.33
```
*When prompted for password, enter:* `@#FS12!@ACs2!` *(keystrokes are hidden).*

---

## 3. Server Setup (Run on VPS)
Run these commands once logged in as `root`:

```bash
# 1. Update system packages
apt update && apt upgrade -y

# 2. Install Node.js 20 LTS & Build Tools
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs git nginx certbot python3-certbot-nginx build-essential

# 3. Install PM2 globally (Process Manager)
npm install -g pm2

# 4. Create web directory
mkdir -p /var/www/econmatrix
cd /var/www/econmatrix
```

---

## 4. Deploy Application Code
Clone your repository or upload files to `/var/www/econmatrix`:
```bash
cd /var/www/econmatrix

# Install dependencies and build production bundle
npm install
npm run build

# Start with PM2
pm2 start dist/server.cjs --name "econmatrix" --env production
pm2 save
pm2 startup
```

---

## 5. Configure Nginx Reverse Proxy
Create Nginx configuration:
```bash
nano /etc/nginx/sites-available/econmatrix
```

Paste this configuration (replace `econmatrix.com` with your actual domain):
```nginx
server {
    listen 80;
    server_name econmatrix.com www.econmatrix.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site & test:
```bash
ln -s /etc/nginx/sites-available/econmatrix /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

---

## 6. Enable Free SSL (HTTPS with Padlock)
```bash
certbot --nginx -d econmatrix.com -d www.econmatrix.com
```
Choose to automatically redirect HTTP to HTTPS when asked.
