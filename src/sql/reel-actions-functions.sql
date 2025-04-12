
-- Function to check if a reel is saved
CREATE OR REPLACE FUNCTION public.is_reel_saved(p_reel_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.saved_reels 
    WHERE reel_id = p_reel_id AND user_id = p_user_id
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Function to save a reel
CREATE OR REPLACE FUNCTION public.save_reel(p_reel_id UUID, p_user_id UUID, p_created_at TIMESTAMPTZ)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.saved_reels (reel_id, user_id, created_at)
  VALUES (p_reel_id, p_user_id, p_created_at);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to unsave a reel
CREATE OR REPLACE FUNCTION public.unsave_reel(p_reel_id UUID, p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  DELETE FROM public.saved_reels
  WHERE reel_id = p_reel_id AND user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if a reel is reposted
CREATE OR REPLACE FUNCTION public.is_reel_reposted(p_reel_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.reposted_reels 
    WHERE reel_id = p_reel_id AND user_id = p_user_id
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Function to repost a reel
CREATE OR REPLACE FUNCTION public.repost_reel(
  p_reel_id UUID, 
  p_user_id UUID, 
  p_original_user_id UUID,
  p_created_at TIMESTAMPTZ
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.reposted_reels (reel_id, user_id, original_user_id, created_at)
  VALUES (p_reel_id, p_user_id, p_original_user_id, p_created_at);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to report content
CREATE OR REPLACE FUNCTION public.report_content(
  p_content_id UUID,
  p_user_id UUID,
  p_content_type TEXT,
  p_reason TEXT,
  p_created_at TIMESTAMPTZ
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.reported_content (content_id, user_id, content_type, reason, created_at)
  VALUES (p_content_id, p_user_id, p_content_type, p_reason, p_created_at);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
