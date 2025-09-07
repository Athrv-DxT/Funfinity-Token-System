# Token Wallet App (Flask)

Features:
- RBAC: admin, manager, user
- Secure auth (hashed passwords)
- Digital wallet with transactions
- QR codes for user accounts
- Admin/Manager can update balances; User sees own QR and balance
- Bulk import with auto email sending (via SMTP)
- Audit logging
- Docker + Railway deploy

## Environment

Create `.env` with:

```
FLASK_ENV=production
SECRET_KEY=change-me
DATABASE_URL=sqlite:///app.db
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=your@gmail.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=Admin1234
ADMIN_EMAIL=admin@example.com
```

## Run locally

```
pip install -r requirements.txt
set FLASK_APP=wsgi.py
python wsgi.py
```

## Deploy on Railway
- Create a new service from this repo
- Set env variables above
- Expose port 8000 (Railway sets $PORT)
- Build with Dockerfile


