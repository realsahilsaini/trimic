import Device from '@/Components/DeviceStats';
import Location from '@/Components/LocationStats';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { UrlState } from '@/context';
import { getClicksForUrl } from '@/db/apiClicks';
// import { getClicksForUrl } from '@/db/apiClicks';
import { deleteUrl, getUrl } from '@/db/apiUrl';
import useFetch from '@/hooks/use-fetch';
import { Copy, CopyCheck, Download, LinkIcon, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { BarLoader, BeatLoader } from 'react-spinners';

const Link = () => {

  const navigate = useNavigate();
  const {user} = UrlState();
  const {id} = useParams();

  const {
    loading,
    data: url,
    fn,
    error,
  } = useFetch(getUrl, {id, user_id: user?.id});


  const {
    loading: loadingStats,
    data: stats,
    fn: fnStats,
  } = useFetch(getClicksForUrl, id);

  const {loading: loadingDelete, fn: fnDelete} = useFetch(deleteUrl, id);


  useEffect(() => {
    fn();
  }, []);

  useEffect(() => {
    if (!error && loading === false) fnStats();
  }, [loading, error]);

  


  if(error){
    navigate('/dashboard');
  }


  let link ='';
  if(url){
    link = url?.custom_url ? url?.custom_url : url?.short_url;  
  }


  const [copySuccess, setCopySuccess] = useState(0);


  useEffect(()=>{

    if(copySuccess){
      setTimeout(()=>{
        setCopySuccess(0);
      }, 1500);
    }

  }, [copySuccess]);


  const downloadImage = ()=>{
    const imageUrl = url?.qr;
    const fileName = url?.title;

    // const anchor = document.createElement('a');
    // anchor.href = imageUrl;
    // anchor.download = fileName;

    // document.body.appendChild(anchor);

    // anchor.click();

    // document.body.removeChild(anchor);

    fetch(imageUrl).then((response) => {
      return response.blob();
    }).then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }


  return (
    <>
    {(loading || loadingStats) && (
      <BarLoader className='mb-4' width={'100%'} color='cyan' />
    )}

    <div className='flex flex-col sm:flex-row gap-8 justify-between'>
      <div className='flex flex-col items-start gap-8 rounded-lg sm:w-2/5'>
        <span className='text-6xl font-extrabold hover:underline cursor-pointer'>
          {url?.title}
        </span>
        <a 
        href={`https://trimic.in/${link}`} 
        target='_blank'
        className="text-3xl sm:text-4xl text-blue-400 font-bold hover:underline cursor-pointer"
        >
          https://trimic.in/{link}
        </a>
        <a 
        href={`https://trimic.in/${link}`} 
        target='_blank'
        className="text-lg flex items-center gap-1 hover:underline cursor-pointer"
        >
        <LinkIcon size={16} />
          {url?.original_url}
        </a>
        <span className="flex items-end font-extralight text-sm">
        {new Date(url?.created_at).toLocaleString("en-US", {
              hour12: true, // Ensures 12-hour format with AM/PM
            })}
        </span>

        <div className="flex gap-2">
        <Button variant='outline' 
        onClick={() => {
          setCopySuccess(1);
          navigator.clipboard.writeText(`https://trimic.me/${url?.custom_url ? url?.custom_url : url?.short_url}`);
        }}
        >
          {copySuccess ? <CopyCheck size={18} /> : <Copy size={16} />}
        </Button>
        <Button variant='outline' onClick={downloadImage}>
          <Download size={16} />
        </Button>
        <Button variant='outline' onClick={() =>
                fnDelete().then(() => {
                  navigate("/dashboard");
                })
              } >
          {loading ? <BeatLoader size={5} color="cyan"/> : <Trash size={16} />}
        </Button>
      </div>

      <img
          src={url?.qr}
          className="w-full self-center sm:self-start ring ring-blue-500 p-1 object-contain"
            alt="qr code"
        />
      </div>

      <Card className='sm:w-3/5'>
  <CardHeader>
    <CardTitle className='text-4xl font-extrabold' >
      Stats
    </CardTitle>
  </CardHeader>
  
  {stats && stats.length ? (
            <CardContent className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Clicks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{stats?.length}</p>
                </CardContent>
              </Card>

              <CardTitle>
                Location Data
              </CardTitle>
              <Location stats={stats} />

              <CardTitle>
                Device Data
              </CardTitle>
              <Device stats={stats} />



            </CardContent>
          ) : (
            <CardContent>
              {loadingStats === false
                ? "No Statistics yet"
                : "Loading Statistics.."}
            </CardContent>
          )}

</Card>

    </div>
    </>
  )
}

export default Link