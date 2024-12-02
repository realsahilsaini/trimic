import supabase from "./supabase";

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