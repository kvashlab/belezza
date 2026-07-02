import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase keys are missing! Uploads will fail.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function uploadFileToSupabase(file: any, path: string): Promise<string> {
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
