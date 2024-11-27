import supabase from "./supabase";

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