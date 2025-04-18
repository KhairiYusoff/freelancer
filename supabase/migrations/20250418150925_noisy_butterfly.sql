/*
  # Initial Schema Setup for Freelance Project Manager

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key) - Links to auth.users
      - `full_name` (text) - User's full name
      - `company_name` (text) - Business/Company name
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `clients`
      - `id` (uuid, primary key)
      - `name` (text) - Client's name
      - `email` (text) - Client's email
      - `company` (text) - Client's company
      - `phone` (text) - Client's phone number
      - `address` (text) - Client's address
      - `notes` (text) - Additional notes
      - `user_id` (uuid) - Reference to profiles
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `projects`
      - `id` (uuid, primary key)
      - `name` (text) - Project name
      - `description` (text) - Project description
      - `status` (text) - Project status (active, completed, on-hold)
      - `start_date` (date) - Project start date
      - `end_date` (date) - Project end date
      - `budget` (numeric) - Project budget
      - `client_id` (uuid) - Reference to clients
      - `user_id` (uuid) - Reference to profiles
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `invoices`
      - `id` (uuid, primary key)
      - `number` (text) - Invoice number
      - `status` (text) - Invoice status (draft, sent, paid)
      - `issue_date` (date) - Date issued
      - `due_date` (date) - Payment due date
      - `amount` (numeric) - Total amount
      - `project_id` (uuid) - Reference to projects
      - `client_id` (uuid) - Reference to clients
      - `user_id` (uuid) - Reference to profiles
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  full_name text,
  company_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create clients table
CREATE TABLE clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  company text,
  phone text,
  address text,
  notes text,
  user_id uuid REFERENCES profiles(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create projects table
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'on-hold')),
  start_date date,
  end_date date,
  budget numeric,
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create invoices table
CREATE TABLE invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number text NOT NULL,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid')),
  issue_date date DEFAULT CURRENT_DATE,
  due_date date,
  amount numeric NOT NULL,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own profile"
  ON profiles
  FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can manage their own clients"
  ON clients
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own projects"
  ON projects
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own invoices"
  ON invoices
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create function to handle profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();