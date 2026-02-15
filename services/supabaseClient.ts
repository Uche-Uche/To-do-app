import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zubanmopbfuuswiverms.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1YmFubW9wYmZ1dXN3aXZlcm1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNjMxNzcsImV4cCI6MjA4NjczOTE3N30.JEHQLXu19tnqO1D_dy9yFNF5VZHzmWtTg0CCf_Lmsok';

export const supabase = createClient(supabaseUrl, supabaseKey);
