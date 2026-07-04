drop policy if exists "Users update own payment screenshots" on storage.objects;
create policy "Users update own payment screenshots" on storage.objects
  for update to authenticated
  using (bucket_id = 'payments' and (storage.foldername(name))[1] = (auth.uid())::text)
  with check (bucket_id = 'payments' and (storage.foldername(name))[1] = (auth.uid())::text);

drop policy if exists "Users delete own payment screenshots" on storage.objects;
create policy "Users delete own payment screenshots" on storage.objects
  for delete to authenticated
  using (bucket_id = 'payments' and (storage.foldername(name))[1] = (auth.uid())::text);