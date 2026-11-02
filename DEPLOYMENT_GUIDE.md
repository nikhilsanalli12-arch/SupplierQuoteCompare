# SupplierQuoteCompare — Render Production Deployment Guide

This guide walks you through deploying **SupplierQuoteCompare** publicly to [Render](https://render.com) backed by a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cloud database.

---

## Architecture Overview

```
                                      +-------------------------------+
                                      |      Client Web Browser       |
                                      +---------------+---------------+
                                                      |
                                                      v
                                      +-------------------------------+
                                      |     Render Static Site        |
                                      |  (React 19 + Vite Frontend)   |
                                      |   supplierquotecompare-ui     |
                                      +---------------+---------------+
                                                      |
                                     REST API Calls   | (CORS Protected)
                                                      v
                                      +-------------------------------+
                                      |       Render Web Service      |
                                      |  (Express.js Node.js Backend) |
                                      |   supplierquotecompare-api    |
                                      +---------------+---------------+
                                                      |
                                      Mongoose Driver | (TLS Encrypted)
                                                      v
                                      +-------------------------------+
                                      |     MongoDB Atlas (Cloud)     |
                                      |  Free M0 Shared Replica Set   |
                                      +-------------------------------+
```

---

## Step 1: Create Free MongoDB Atlas Cloud Database

1. **Sign Up / Log In**:
   - Visit [cloud.mongodb.com](https://cloud.mongodb.com) and create an account.
2. **Create a Free Cluster**:
   - Choose **M0 Free** (Shared tier).
   - Select your preferred cloud provider and region (e.g., AWS / Mumbai `ap-south-1` or Oregon `us-west-2`).
   - Cluster Name: `SupplierQuoteCluster` (or default `Cluster0`).
   - Click **Create Deployment**.
3. **Set Up Security & Credentials**:
   - Under **Security** $\rightarrow$ **Database Access**:
     - Click **Add New Database User**.
     - Authentication Method: **Password**.
     - Username: `admin_user` (or your choice).
     - Password: Choose a strong password (save it safely).
     - User Privileges: **Read and write to any database**.
     - Click **Add User**.
4. **Configure IP Access Whitelist**:
   - Under **Security** $\rightarrow$ **Network Access**:
     - Click **Add IP Address**.
     - Click **Allow Access from Anywhere** (`0.0.0.0/0`).
     - Click **Confirm**. *(Required so Render cloud servers can connect).*
5. **Obtain Connection String**:
   - Go to **Database** $\rightarrow$ **Clusters** $\rightarrow$ Click **Connect**.
   - Select **Drivers** (Node.js).
   - Copy the SRV URI format:
     ```
     mongodb+srv://admin_user:<password>@cluster0.xxxxx.mongodb.net/supplierquotecompare?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your database user password.

---

## Step 2: Push Your Code to GitHub

1. Ensure all code is committed to your repository branch:
   ```bash
   git status
   git push origin master
   ```

---

## Step 3: Deploy on Render

### Option A: Automatic Deployment using Render Blueprint (Recommended)

1. Log in to [dashboard.render.com](https://dashboard.render.com).
2. Click **New +** $\rightarrow$ **Blueprint**.
3. Connect your GitHub repository (`SupplierQuoteCompare`).
4. Render will automatically detect the [render.yaml](file:///c:/Users/Nikhikumar%20s/OneDrive/Documents/SupplierQuoteCompare/render.yaml) file.
5. In the configuration prompt, enter your `MONGODB_URI` from Step 1.
6. Click **Apply**. Render will automatically build and deploy both the backend API and frontend static site.

---

### Option B: Manual Setup (Step-by-Step)

If you prefer to configure each service manually:

#### 1. Deploy the Backend API (Web Service)
1. In Render Dashboard, click **New +** $\rightarrow$ **Web Service**.
2. Connect your GitHub repository.
3. Configure the following settings:
   - **Name**: `supplierquotecompare-api`
   - **Region**: Oregon (or matching Atlas region)
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`
4. Add **Environment Variables**:
   | Variable | Value | Notes |
   | :--- | :--- | :--- |
   | `NODE_ENV` | `production` | Enables production mode |
   | `PORT` | `10000` | Port for Express listener |
   | `MONGODB_URI` | `mongodb+srv://...` | Your Atlas connection string |
   | `CLIENT_URL` | `*` *(or your frontend URL)* | CORS permitted domain |
5. Click **Create Web Service**. Wait for the build to succeed.
6. Copy your deployed API URL (e.g. `https://supplierquotecompare-api.onrender.com`).

#### 2. Deploy the Frontend (Static Site)
1. In Render Dashboard, click **New +** $\rightarrow$ **Static Site**.
2. Connect the same GitHub repository.
3. Configure the following settings:
   - **Name**: `supplierquotecompare-ui`
   - **Branch**: `master`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add **Environment Variables**:
   | Variable | Value | Notes |
   | :--- | :--- | :--- |
   | `VITE_API_BASE_URL` | `https://supplierquotecompare-api.onrender.com/api` | URL of your deployed backend + `/api` |
5. Add **Rewrite Rule** (for client-side routing):
   - Under **Redirects/Rewrites**:
     - **Source**: `/*`
     - **Destination**: `/index.html`
     - **Action**: `Rewrite`
6. Click **Create Static Site**.

---

## Step 4: Verification & Smoke Testing

Once deployed, verify the live deployment:

1. **Check Backend Health**:
   - Open `https://<your-backend-api>.onrender.com/api/health` in your browser.
   - Expected response:
     ```json
     {
       "status": "healthy",
       "message": "SupplierQuoteCompare API is operational",
       "environment": "production",
       "database": {
         "isAtlas": true,
         "databaseType": "MongoDB Atlas (Remote Cloud Cluster)",
         "connectionState": "Connected"
       }
     }
     ```
2. **Check Frontend**:
   - Open your Static Site URL (e.g. `https://supplierquotecompare-ui.onrender.com`).
   - Confirm all 5 modules load and display live data:
     - **Dashboard**: Evaluated pipeline metrics and quick links.
     - **Suppliers**: Add, edit, search, and view vendor profiles.
     - **Quotations**: Create quotations with dynamic line items, recalculations, and draft saves.
     - **Compare**: Side-by-side normalisation, dimension compatibility check, and commercial terms.
     - **Reports**: Configurable criteria sliders, scorecards, and single-click **Export PDF Report**.

---

## Troubleshooting & Maintenance

- **CORS Errors**: Ensure `CLIENT_URL` on the backend matches the domain of your deployed frontend.
- **MongoDB Connection Timeouts**: Verify your IP Whitelist on Atlas includes `0.0.0.0/0` (Allow from Anywhere).
- **Free Tier Cold Starts**: Render's free tier spins down inactive web services after 15 minutes. The initial request after inactivity may take 30-50 seconds to warm up. Subsequent requests respond instantly.
