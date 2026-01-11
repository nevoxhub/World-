import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// আপনার Supabase এর তথ্য (আগে যা দিয়েছিলেন)
const SUPABASE_URL = 'https://bvwnpyajexocigoxhvrm.supabase.co';
const SUPABASE_KEY = 'sb_publishable_tjFxPa_SDPojkJrXVLzHPw_1HMebCPS';

// ক্লায়েন্ট তৈরি
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// গ্লোবাল এক্সেস (কনসোলে টেস্ট করার জন্য)
window.supabase = supabase;
