import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zubanmopbfuuswiverms.supabase.co';
const supabaseKey = 'sb_publishable_8jT96lC7CNCBhyExpE-2Cg_1Y1FiRzT';

export const supabase = createClient(supabaseUrl, supabaseKey);
