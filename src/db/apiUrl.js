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



const parser = new UAParser();

export const storeClicks = async({id, originalUrl}) =>{

  try{

    const res = parser.getResult();
    const device  = res.type || 'desktop';

    const response = await fetch('https://ipapi.co/json');
    const {city, country_name: country} = await response.json();


    await supabase.from('clicks').insert({
      url_id: id,
      device,
      city,
      country
    })


    window.location.href = originalUrl;

  }catch(error){
    console.error('Error while recording clicks:', error);
  }

}
