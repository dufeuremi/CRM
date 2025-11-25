# Supabase Storage RLS Policies for call_records bucket

Here are the Row Level Security (RLS) policies to apply to your `call_records` bucket in Supabase. These policies ensure that users can only access their own recordings.

## Policies for `storage.objects` table

You need to apply these policies on the `storage.objects` table for the `call_records` bucket.

### 1. Allow authenticated users to upload to their own folder

This policy allows an authenticated user to insert (upload) files into a folder that matches their user ID. The user's ID is extracted from the JWT token (`auth.uid()`).

```sql
CREATE POLICY "user_uploads" ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'call_records' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

### 2. Allow authenticated users to read their own files

This policy allows an authenticated user to select (read/download) files from a folder that matches their user ID.

```sql
CREATE POLICY "user_reads" ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'call_records' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

### 3. Allow authenticated users to update their own files

This policy allows an authenticated user to update their own files.

```sql
CREATE POLICY "user_updates" ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'call_records' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

### 4. Allow authenticated users to delete their own files

This policy allows an authenticated user to delete their own files.

```sql
CREATE POLICY "user_deletes" ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'call_records' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

## How to apply these policies

1.  Go to your Supabase project dashboard.
2.  Navigate to the "SQL Editor".
3.  Create a "New query".
4.  Copy and paste the SQL statements above into the query editor.
5.  Run the query.

Make sure you have already created the `call_records` bucket. If not, you can create it from the "Storage" section in your Supabase dashboard.
