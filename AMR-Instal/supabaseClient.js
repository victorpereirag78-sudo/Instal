if (typeof window.supabase === 'undefined') {
    console.error('❌ SDK de Supabase no cargado. Verifica que el script UMD esté en index.html ANTES de este archivo');
} else {
    // Obtener credenciales de config.js
    const SUPABASE_URL = window.CONFIG?.supabase?.url?.trim();
    const SUPABASE_KEY = window.CONFIG?.supabase?.anonKey?.trim();
    
    if (!SUPABASE_URL || !SUPABASE_KEY) {
        console.error('❌ Credenciales de Supabase faltantes en CONFIG');
    } else {
        // ✅ Crear cliente y exponerlo como window.supabase (sobrescribe el SDK constructor)
        // Así tu código existente en app.js sigue funcionando sin cambios
        window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log('✅ Supabase client inicializado:', SUPABASE_URL);
    }
}