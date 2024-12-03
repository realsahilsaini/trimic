import { getLongUrl, storeClicks } from '@/db/apiUrl';
import useFetch from '@/hooks/use-fetch';
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { BarLoader } from 'react-spinners';

const RedirectLink = () => {

  const {id} = useParams();

  const {loading, data, fn} = useFetch(getLongUrl, id);

  const {loading: loadingClicks, data: dataClicks, fn: fnStats} = useFetch(storeClicks, {
    id: data?.id,
    originalUrl: data?.original_url
  });


  useEffect(()=>{
    //To get the long url
    fn();
  }, []);


  useEffect(()=>{
    if(!loading && data){
      //To store the clicks
      fnStats();
    }
  },[loading, data])


  if(loading || loadingClicks){
    return (
      <>
        <BarLoader width={'100%'} color="cyan" />
        <br />
        Redirecting...
      </>
    )
  }

  return null;
}

export default RedirectLink