import { UAParser } from "ua-parser-js";
import supabase, { supabaseUrl } from "./supabase";

export async function getUrls(user_id) {
  const {data, error} = await supabase
  .from('urls')
  .select('*')
  .eq('user_id', user_id);

  if (error) {
    console.error(error.mesage);
    throw new Error('An error occured while fetching urls'); 
  }

  return data;
}

export async function deleteUrl(id) {
  const {data, error} = await supabase
  .from('urls')
  .delete('*')
  .eq('id', id);

  if (error) {
    console.error(error.mesage);
    throw new Error('An error occured while fetching urls'); 
  }

  return data;
}


export async function createUrl({title, originalUrl, customUrl ,user_id}, qrcode) {

//Generate a random short url if custom url is not provided
  const short_url = Math.random().toString(36).substring(2,6);

  const fileName = `qr-${short_url}-${Date.now()}`;

  const {error: storageError} = await supabase.storage
  .from('qrs')
  .upload(fileName, qrcode);

  if(storageError) throw new Error(storageError.message);

  const qr = `${supabaseUrl}/storage/v1/object/public/qrs/${fileName}`


  const {data, error} = await supabase
  .from('urls')
  .insert([
    {
      title, 
      original_url: originalUrl, 
      custom_url:customUrl ||null, 
      short_url, 
      user_id, 
      qr
    }
  ]).select();


  if (error) {
    console.error(error.mesage);
    throw new Error('Error while creating short URl'); 
  }

  return data;
}



export async function getLongUrl(id) {
  const {data, error} = await supabase
  .from('urls')
  .select("id, original_url")
  .or(`short_url.eq.${id}`, `custom_url.eq.${id}`)
  .single();

  if (error) {
    console.error(error.mesage);
    throw new Error('An error occured while fetching short Url'); 
  }

  return data;
}

export async function getUrl({id, user_id}) {
  const {data, error} = await supabase
  .from('urls')
  .select("*")
  .eq('id', id)
  .eq('user_id', user_id)
  .single();
  

  if (error) {
    console.error(error.mesage);
    throw new Error('Short Url not found'); 
  }

  return data;
}




