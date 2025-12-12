# ISMPH Database Setup Guide

## Prerequisites

1. A Supabase account and project
2. Node.js installed locally

## Step 1: Configure Environment Variables

Create a `.env` file in the project root:

```bash
# Windows PowerShell
Copy-Item .env.example .env
```

Edit the `.env` file with your Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**Where to find these:**
1. Go to your Supabase Dashboard
2. Navigate to **Settings** → **API**
3. Copy the **Project URL** and **anon public** key

## Step 2: Deploy the Database Schema

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the contents of `database_schema.sql`
5. Click **Run** to execute

The schema creates the following tables:

| Table | Description |
|-------|-------------|
| `profiles` | User accounts with roles |
| `reports` | PHC reports with approval workflow |
| `diseases` | Disease tracking by zone and state |
| `messages` | Chat messages for real-time communication |
| `feedback` | User feedback and PHC issue reports |
| `phc_facilities` | Primary Healthcare Center locations |
| `policy_commitments` | Government policy information |
| `thematic_categories` | Health topic categories |
| `notifications` | User notifications |
| `chat_history` | AI chatbot conversation history |

## Step 3: Verify Row Level Security (RLS)

The schema automatically enables RLS on all tables with appropriate policies:

- **Users** can only see their own data
- **Admins** (state_admin, super_admin) can see all data in their domain
- **Public data** (diseases, facilities, etc.) is readable by all authenticated users

## Database Schema Overview

### Tables Connected to App

| Table | Redux Slice | Operations |
|-------|-------------|------------|
| `profiles` | `authSlice` | Sign in/up, fetch/update profile |
| `reports` | `reportsSlice` | CRUD operations on reports |
| `diseases` | `diseasesSlice` | Fetch disease data |
| `messages` | `chatService` | Real-time messaging |
| `feedback` | `feedbackSlice` | CRUD operations on feedback |
| `notifications` | `notificationsSlice` | Fetch, mark as read |
| `phc_facilities` | `facilitiesSlice` | Search and fetch facilities |
| `policy_commitments` | `policySlice` | Fetch policy tracking data |
| `thematic_categories` | `categoriesSlice` | Fetch categories for reports |

### User Roles

| Role | Permissions |
|------|-------------|
| `public` | Submit reports, view own data |
| `staff` | All public permissions + messaging |
| `state_admin` | All staff permissions + manage state data |
| `super_admin` | Full access to all data |

## Testing the Connection

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Try to sign up a new user
3. Check the Supabase dashboard to see if the user was created in:
   - **Authentication** → **Users**
   - **Table Editor** → **profiles**

## Troubleshooting

### "Supabase credentials are required" Error
- Ensure `.env` file exists in project root
- Verify the environment variable names start with `EXPO_PUBLIC_`
- Restart the development server after creating `.env`

### "Profile not found" Error
- The `profiles` table RLS might be blocking access
- Check if the profile was created during sign-up
- Verify RLS policies are correctly applied

### Real-time Messages Not Working
- Ensure Realtime is enabled in Supabase Dashboard
- Go to **Database** → **Replication** → Enable for `messages` table

## Seed Data

The schema includes sample data for testing:

- 4 Admin profiles (Lagos, Kano, Kaduna, Super Admin)
- 10 Disease records
- 4 PHC Facilities
- 4 Policy Commitments
- 12 Thematic Categories
- 2 Sample Reports
- 2 Sample Feedback entries

**Note:** The seed data uses placeholder UUIDs. For production, create real users and update the foreign keys accordingly.

## Next Steps

1. ✅ Create `.env` file with Supabase credentials
2. ✅ Deploy `database_schema.sql` to Supabase
3. Test authentication flow
4. Test report submission
5. Test real-time messaging
