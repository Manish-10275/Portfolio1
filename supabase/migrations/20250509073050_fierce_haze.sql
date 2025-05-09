/*
  # Create tables for portfolio content management

  1. New Tables
    - `education`
      - `id` (uuid, primary key)
      - `year` (text)
      - `title` (text)
      - `description` (text)
      - `created_at` (timestamp)
    
    - `skills`
      - `id` (uuid, primary key)
      - `category` (text)
      - `name` (text)
      - `created_at` (timestamp)
    
    - `experience`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `icon` (text)
      - `created_at` (timestamp)
    
    - `projects`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `icon` (text)
      - `link` (text)
      - `created_at` (timestamp)
    
    - `social_links`
      - `id` (uuid, primary key)
      - `platform` (text)
      - `url` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated admin access
*/

-- Create education table
CREATE TABLE IF NOT EXISTS education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create experience table
CREATE TABLE IF NOT EXISTS experience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  link text,
  created_at timestamptz DEFAULT now()
);

-- Create social_links table
CREATE TABLE IF NOT EXISTS social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON education FOR SELECT USING (true);
CREATE POLICY "Enable write access for authenticated users only" ON education FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all users" ON skills FOR SELECT USING (true);
CREATE POLICY "Enable write access for authenticated users only" ON skills FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all users" ON experience FOR SELECT USING (true);
CREATE POLICY "Enable write access for authenticated users only" ON experience FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all users" ON projects FOR SELECT USING (true);
CREATE POLICY "Enable write access for authenticated users only" ON projects FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all users" ON social_links FOR SELECT USING (true);
CREATE POLICY "Enable write access for authenticated users only" ON social_links FOR ALL USING (auth.role() = 'authenticated');