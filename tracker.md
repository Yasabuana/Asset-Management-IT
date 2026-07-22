# Server Deployment & Tracking Guide - Asset Management IT

Berikut adalah langkah-langkah untuk melakukan update dan deploy terbaru proyek **Asset Management IT** di server:

```bash
# 1. Masuk ke direktori proyek di server
cd /home/clgadmin01/apps/Asset-Management-IT

# 2. Tarik update terbaru dari Git
git pull origin main

# 3. Rebuild dan restart container secara otomatis (tanpa downtime lama)
docker compose up -d --build --force-recreate
```
