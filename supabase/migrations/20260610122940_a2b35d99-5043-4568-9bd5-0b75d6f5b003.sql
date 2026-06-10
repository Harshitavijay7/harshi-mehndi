-- Payment detail columns on orders
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS transaction_id TEXT,
  ADD COLUMN IF NOT EXISTS payment_screenshot_path TEXT,
  ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'pending';

-- ============ Storage RLS policies ============
-- products & gallery: readable by everyone, writable by admins only
CREATE POLICY "Public read products bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'products');

CREATE POLICY "Admins manage products bucket"
  ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'products' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'products' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public read gallery bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gallery');

CREATE POLICY "Admins manage gallery bucket"
  ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'gallery' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'gallery' AND public.has_role(auth.uid(), 'admin'));

-- payments: customers can upload their screenshots, only admins can read
CREATE POLICY "Users upload payment screenshots"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'payments');

CREATE POLICY "Admins read payment screenshots"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'payments' AND public.has_role(auth.uid(), 'admin'));