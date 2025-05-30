-- Create a function to delete a curve version and its phases in a transaction
CREATE OR REPLACE FUNCTION delete_curve_version(p_version_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- First delete all phases for this version
  DELETE FROM curve_phases
  WHERE version_id = p_version_id;

  -- Then delete the version itself
  DELETE FROM curve_versions
  WHERE id = p_version_id;
END;
$$; 