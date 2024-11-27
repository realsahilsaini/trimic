import supabase, {supabaseUrl} from "./supabase";

export async function login({email, password}) {
  const {data, error} = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  return data;
}


//This function will get user data from localStorage and return it. (If logged in)
export async function getCurrentUser(){
  //supabase will cheeck the local storage for the session and return it.
  const {data: session, error} = await supabase.auth.getSession();

  //If there is no session, in other words, if the user is not logged in, we will return null.
  if(!session.session)  return null;

  //If there is an error, we will throw an error.
  if(error) throw new Error(error.message);

  return session.session?.user;
}


export async function signup({name, email, password, profile_pic}){
  const fileName = `dp-${name.split(' ').join('-')}-${Date.now()}`;
  const {error: storageError} = await supabase.storage.from('profile_pic').upload(fileName, profile_pic);

  if(storageError) throw new Error(storageError.message);

  const {data, error} = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        profile_pic: `${supabaseUrl}/storage/v1/object/public/profile_pic/${fileName}`
      }
    }
  });

  if (error) throw new Error(error.message);

  return data;
}

export async function logout(){
  const {error} = await supabase.auth.signOut();

  if(error) throw new Error(error.message);

  return null;
}