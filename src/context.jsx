import { createContext, useContext, useEffect } from 'react';
import useFetch from './hooks/use-fetch';
import { getCurrentUser } from './db/apiAuth';

const UrlContext = createContext();

const UrlProvider = ({ children }) => {

  const {data: user, loading, fn:fetchUser} = useFetch(getCurrentUser);

  const isAuthenticated = user?.role === 'authenticated';

  useEffect(()=>{
    //This will run getCurrentUser function when the component is mounted.
    fetchUser();
  },[])

  return (
    <UrlContext.Provider 
    value={{user, fetchUser, loading, isAuthenticated}}>
      {children}
    </UrlContext.Provider>
  )
}

 //Whenever we want to use the context, we will use this function.
export const UrlState = () =>{
  return useContext(UrlContext);
}


export default UrlProvider;