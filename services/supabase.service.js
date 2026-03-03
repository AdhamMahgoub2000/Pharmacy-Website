angular.module('pharmacyApp')
.service('SupabaseService', function() {
    
    const SUPABASE_URL = 'https://hzzsqzknrbonxjdsznjy.supabase.co'; 
    const SUPABASE_KEY = 'sb_publishable_gF_vQjT9-OE-BvZnWBlgRg_rJMlApY2'; 

    this.client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
});