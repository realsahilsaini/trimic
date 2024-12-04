import { UrlState } from '@/context'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog"
import { Button } from './ui/button';
import { Input } from './ui/input';
import Error from './Error';
import { Card } from './ui/card';
import * as yup from 'yup';
import useFetch from '@/hooks/use-fetch';
import { QRCode } from 'react-qrcode-logo';
import QRlogo from '/logo.png';
import { createUrl } from '@/db/apiUrl';
import { BeatLoader } from 'react-spinners';

const CreateLink = () => {

  const {user} = UrlState();
  const navigate = useNavigate();


  const ref = useRef();

  //As soon as user lands in dash board, we will check if there is a createnew query in the url. If yes, we will open the create link modal with the prefilled url.
  const [searchParams, setSearchParams] = useSearchParams();

  const longLink = searchParams.get('createNew');

  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState({
    title: '',
    longUrl: longLink ? longLink : '',
    customUrl: '',
  });


  const schema = yup.object().shape({
    title: yup
    .string()
    .required('Title is required'),

    longUrl: yup
    .string()
    .url('Please enter a valid URL')
    .required('URL is required'),

    customUrl: yup
    .string()

  });


  useEffect(()=>{
    console.log(ref);
    
  },[ref])


  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.id]: e.target.value
    });
  }


  const {loading, error, data, fn:fnCreateUrl} = useFetch(createUrl, {...formValues, user_id: user.id});


  const createNewLink = async () =>{
    setErrors([]);

    try{
      await schema.validate(formValues, {abortEarly: false});

      //QRCode gnerates canvas element. We need to get the image from the canvas element and upload it to the storage.
      const canvas = ref.current.canvasRef.current;

      //This will successfully convert the QR to a blob
      const blob = await new Promise((resolve)=>{
        canvas.toBlob((blob)=>{
          resolve(blob);
        })
      })

      await fnCreateUrl(blob);

    }catch(error){
      const newErrors = {};

      error?.inner?.forEach((err)=>{
        newErrors[err.path] = err.message;
      });

      setErrors(newErrors);
    }

  }


  useEffect(()=>{

    if(error === null && data){
      navigate(`/link/${data[0].id}`);
    }

  },[data, error])



  return (

      <Dialog defaultOpen={longLink} 
      onOpenChange={(res)=>{
        if(!res){
          setSearchParams()
        } 
        }} >
  <DialogTrigger>
    <Button  >
      Create New Link
    </Button>
  </DialogTrigger>
  <DialogContent className='sm:max-w-md rounded-lg' >
    <DialogHeader>
      <DialogTitle className='font-bold text-2xl' >Create New</DialogTitle>
    </DialogHeader>




    {formValues.longUrl &&
    <QRCode value={formValues.longUrl} size={250} ref={ref} logoImage={QRlogo} logoWidth={100} />
    }


    

    <Input id='title' value={formValues.title} onChange={handleChange} placeholder="Short Link's Title" />
    {errors.title && <Error message={errors.title} />}

    <Input id='longUrl' onChange={handleChange} placeholder="Enter your Looooog URL" value={formValues.longUrl} />
    {errors.longUrl && <Error message={errors.longUrl} />}

    <div className='flex flex-row items-center gap-4'>
      <Card className='p-2 w-fit bg-gray-900' >trimic.in/</Card>
    <Input id='customUrl' onChange={handleChange} placeholder="Custom Link (optional)" value={formValues.customUrl} />
    </div>

    {/* Overall error while creating the link */}
    {error && <Error message={error.message} />}

    <DialogFooter className='sm:justify-start' >
      <Button disable={loading} type="submit" onClick={createNewLink} >
        {loading ? <BeatLoader size={10} color='cyan' /> : 'Create'}
      </Button>
    </DialogFooter>

  </DialogContent>
</Dialog>


  )
}

export default CreateLink