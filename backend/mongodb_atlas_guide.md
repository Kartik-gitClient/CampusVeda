# MongoDB Atlas Connection Guide

Connecting your PRITHVEDA application to MongoDB Atlas is straightforward. Follow these steps:

## 1. Create a MongoDB Atlas Account
If you don't have one, sign up at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas/register).

## 2. Create a New Cluster
- Click **"Deploy a Database"**.
- Choose the **FREE** (M0) tier.
- Select a provider (e.g., AWS) and a region near you.
- Click **"Create"**.

## 3. Configure Database Access
- Go to **"Database Access"** in the left sidebar.
- Click **"Add New Database User"**.
- Choose **"Password"** authentication.
- Set a **Username** and **Password** (Save these!).
- Under "User Privileges", choose **"Read and write to any database"**.
- Click **"Add User"**.

## 4. Configure Network Access (CRITICAL)
- Go to **"Network Access"** in the left sidebar.
- Click **"Add IP Address"**.
- **For easy connection during development**: Click **"ALLOW ACCESS FROM ANYWHERE"** (0.0.0.0/0). 
  > [!IMPORTANT]
  > This is convenient for development but should be restricted to specific IPs in production.
- Click **"Confirm"**.

## 5. Get Your Connection String
- Go to **"Database"** (Deployment) in the left sidebar.
- Click **"Connect"** on your cluster.
- Choose **"Drivers"**.
- Select **Node.js** as the driver.
- Copy the connection string. It looks like this:
  `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

## 6. Update Your `.env` File
In your `backend` directory, update (or create) the `.env` file:

```env
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/prithveda?retryWrites=true&w=majority
```

> [!TIP]
> Make sure to replace `<password>` with the actual password you created for the database user, and you can specify the database name (e.g., `/prithveda`) before the query parameters.

## 7. Restart the Server
Once updated, restart your backend server:
```bash
npm run dev
```

The console should log: `MongoDB Connected: cluster0-shard-00-01.xxxxx.mongodb.net`
