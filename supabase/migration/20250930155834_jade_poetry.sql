/*
  # Create RSVP Tokens Table

  1. New Tables
    - `rsvp_tokens`
      - `id` (uuid, primary key)
      - `guest_id` (uuid, foreign key to guests)
      - `token` (uuid, unique)
      - `status` (text, the RSVP status this token represents)
      - `created_at` (timestamp)
      - `used_at` (timestamp, optional)

  2. Security
    - Enable RLS on `rsvp_tokens` table
    - Add policies for token management
*/

CREATE TABLE IF NOT EXISTS rsvp_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id uuid REFERENCES guests(id) ON DELETE CASCADE NOT NULL,
  token uuid UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  status text NOT NULL CHECK (status IN ('accepted', 'declined', 'maybe')),
  created_at timestamptz DEFAULT now(),
  used_at timestamptz
);

-- Enable Row Level Security
ALTER TABLE rsvp_tokens ENABLE ROW LEVEL SECURITY;

-- Create policies for rsvp_tokens
CREATE POLICY "Tokens can be read by anyone"
  ON rsvp_tokens
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can create tokens"
  ON rsvp_tokens
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update tokens"
  ON rsvp_tokens
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS rsvp_tokens_guest_id_idx ON rsvp_tokens(guest_id);
CREATE INDEX IF NOT EXISTS rsvp_tokens_token_idx ON rsvp_tokens(token);