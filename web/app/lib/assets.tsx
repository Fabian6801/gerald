const base = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/logo`;

// Bump the number after ?v= when you replace a file, so browsers fetch the new one
export const assets = {
  logoVideo: `${base}/logo.mp4?v=1`,
  logoPoster: `${base}/logo-poster.jpg?v=1`,
  icon: `${base}/icon.png?v=1`,
  appleIcon: `${base}/apple-icon.png?v=1`,
  gerardPhoto: `${base}/gerard.jpeg?v=1`,
};