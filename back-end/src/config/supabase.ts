import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase keys are missing! Uploads will fail.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function uploadFileToSupabase(file: any, path: string): Promise<string> {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase storage não configurado. Defina SUPABASE_URL e SUPABASE_KEY no .env do backend.');
  }

  const { data, error } = await supabase.storage
    .from('belezza-uploads')
    .upload(path, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });
    
  if (error) {
    throw new Error('Falha ao subir arquivo para o Supabase: ' + error.message);
  }
  
  const { data: publicData } = supabase.storage
    .from('belezza-uploads')
    .getPublicUrl(path);
    
  return publicData.publicUrl;
}
