-- 1) bookings_guest_user_id_null: require auth + ownership for bookings.
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;

CREATE POLICY "Authenticated users create own bookings"
  ON public.bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 2) payments_bucket_any_authenticated_upload: restrict to own folder.
DROP POLICY IF EXISTS "Users upload payment screenshots" ON storage.objects;

CREATE POLICY "Users upload own payment screenshots"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'payments'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 3) SUPA_authenticated_security_definer_function_executable:
-- has_role is SECURITY DEFINER; block direct client execution.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM authenticated;