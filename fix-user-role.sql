-- Check and fix user role

-- First, let's see the current user
SELECT id, name, email, role FROM users WHERE email = 'shaharyan251461@gmail.com';

-- Update to admin if not already
UPDATE users SET role = 'admin' WHERE email = 'shaharyan251461@gmail.com';

-- Verify the update
SELECT id, name, email, role FROM users WHERE email = 'shaharyan251461@gmail.com';

-- Show all users
SELECT id, name, email, role FROM users;
