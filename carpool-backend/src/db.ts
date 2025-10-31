import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env file');
    process.exit(1);
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function testConnection() {
    try {
        const { data, error } = await supabase.from('rides').select('*').limit(1);
        if (error) throw error;
        console.log('✅ Supabase connection verified.');
    } catch (err) {
        console.error('⚠️  Supabase connection failed:', (err as Error).message);
    }
}
