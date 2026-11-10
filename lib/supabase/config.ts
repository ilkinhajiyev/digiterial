// Supabase layihəsinin açıq (public) dəyərləri. Bunlar onsuz da brauzerə göndərilir, gizli deyil.
// Hostinger-də env build-ə çatmaya bilər, ona görə kodda ehtiyat dəyər saxlanılır; env varsa o üstündür.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zbvcpecpwljzzcddbsxv.supabase.co';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpidmNwZWNwd2xqenpjZGRic3h2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1OTg2NjAsImV4cCI6MjA5ODE3NDY2MH0.0igZHxOsY1SyYyU6nXPYVTNa1FJR5gzvpl4vYvCKNLw';
