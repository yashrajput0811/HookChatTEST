# Deployment Guide

## Frontend Deployment (Vercel)

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-github-repo-url
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Sign up/Login with your GitHub account
   - Click "New Project"
   - Import your GitHub repository
   - Configure the project:
     - Framework Preset: Vite
     - Root Directory: client
     - Build Command: `npm run build`
     - Output Directory: dist
     - Install Command: `npm install`

3. **Set up Environment Variables in Vercel**
   - Go to Project Settings > Environment Variables
   - Add the following variables:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_KEY=your_supabase_key
     VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
     ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically deploy your frontend

## Backend Deployment (Railway)

1. **Push your code to GitHub**
   - Make sure your server code is in a separate directory (e.g., `server/`)

2. **Deploy to Railway**
   - Go to [Railway](https://railway.app)
   - Sign up/Login with your GitHub account
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select the server directory

3. **Set up Environment Variables in Railway**
   - Go to Project Settings > Variables
   - Add all variables from your `.env` file:
     ```
     PORT=3001
     CLIENT_URL=your_vercel_app_url
     SUPABASE_URL=your_supabase_url
     SUPABASE_KEY=your_supabase_key
     SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
     STRIPE_SECRET_KEY=your_stripe_secret_key
     STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
     MODERATION_API_KEY=your_moderation_api_key
     ADMIN_EMAIL=your_admin_email
     ```

4. **Configure Deployment**
   - Set the start command: `npm start`
   - Set the build command: `npm install`

5. **Deploy**
   - Railway will automatically deploy your backend
   - Note the deployment URL for your frontend configuration

## Supabase Setup

1. **Create Project**
   - Go to [Supabase](https://supabase.com)
   - Create a new project
   - Note down the project URL and anon/public key

2. **Set up Database**
   - Go to SQL Editor
   - Copy and paste the contents of `supabase/schema.sql`
   - Run the SQL script

3. **Configure Authentication**
   - Go to Authentication > Settings
   - Enable Email auth provider
   - Configure social providers if needed
   - Set up email templates

4. **Set up Storage**
   - Go to Storage
   - Create a new bucket named "avatars"
   - Set up appropriate storage policies

5. **Configure Realtime**
   - Go to Database > Replication
   - Enable realtime for the following tables:
     - messages
     - chat_rooms

## Post-Deployment Steps

1. **Update Frontend Configuration**
   - Update the `VITE_API_URL` in Vercel to point to your Railway backend URL

2. **Test the Application**
   - Verify that the frontend can connect to the backend
   - Test authentication flow
   - Test real-time chat functionality
   - Verify premium features with Stripe

3. **Set up Monitoring**
   - Configure error tracking (e.g., Sentry)
   - Set up logging
   - Monitor performance metrics

4. **Security Checklist**
   - Verify CORS settings
   - Check SSL/TLS configuration
   - Review API rate limiting
   - Test authentication flows
   - Verify database security rules 