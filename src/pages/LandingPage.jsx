import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/Components/ui/accordion'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LandingPage = () => {

  const [LongUrl, setLongUrl] = useState('');
  const naviagte = useNavigate();

  const handelShorten = (e) => {
    //This will prevent the page from reloading when the form is submitted
    e.preventDefault();

    console.log(LongUrl);
    

    if(LongUrl){
      naviagte(`/auth?createNew=${LongUrl}`)
    }
  }

  return (
    <div className='flex flex-col justify-center items-center'>
      <h2 className="my-10 font-Orbitron sm:my-12 text-3xl lg:tracking-wide text-lime
       sm:text-6xl lg:text-7xl text-center font-bold">
        The only URL shortener <br />
        you&rsquo;ll ever need. 👇🏻
      </h2>


      <form onSubmit={handelShorten}
      className="sm:h-12 flex flex-col sm:flex-row w-full md:w-2/4 gap-2"
      
      >
        <Input type='url' onChange={(e)=>setLongUrl(e.target.value)} value={LongUrl} placeholder='Enter your Looooong URL!'className="h-full flex-1 py-4 px-4" />

      <Button type="submit" className="h-full" variant="destructive" 
      >
        Shorten!
      </Button>
      </form>

      <img src="/banner.jpg" alt="banner" className='w-[90%] sm:max-w-3xl xl:max-w-5xl py-11 md:px-11 mx-auto' />


      <Accordion type="multiple" collapsible='true' className="w-full md:px-11">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            How does the Trimic URL shortener works?
          </AccordionTrigger>
          <AccordionContent>
            When you enter a long URL, our system generates a shorter version of
            that URL. This shortened URL redirects to the original long URL when
            accessed.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            Do I need an account to use the app?
          </AccordionTrigger>
          <AccordionContent>
            Yes. Creating an account allows you to manage your URLs, view analytics, and customize your short URLs.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>
            What analytics are available for my shortened URLs?
          </AccordionTrigger>
          <AccordionContent>
            You can view the number of clicks, geolocation data of the clicks and device types (mobile/desktop) for each of your shortened URLs.
          </AccordionContent>
        </AccordionItem>
      </Accordion>

    </div>
  )
}

export default LandingPage