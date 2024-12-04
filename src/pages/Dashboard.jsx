import CreateLink from "@/Components/CreateLink";
import Error from "@/Components/Error";
import LinkCard from "@/Components/LinkCard";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { UrlState } from "@/context";
import { getClicksForUrls } from "@/db/apiClicks";
import { getUrls } from "@/db/apiUrl";
import useFetch from "@/hooks/use-fetch";
import { FilterIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

const Dashboard = () => {

  //State for search query
  const [searchQuery, setSearchQuery] = useState('');

  //Getting user from context (Details Logged in user) 
  const {user} = UrlState();
  

  const {loading, error, data: urls, fn:fnUrls} =  useFetch(getUrls, user?.id);

  const {loading: loadingClicks, data: clicks, fn:fnClicks} = useFetch(getClicksForUrls, urls?.map(url=>url.id));


  useEffect(()=>{
    fnUrls();  
  },[])

  useEffect(()=>{
    if(urls?.length > 0){
      fnClicks();
    }
  },[urls?.length])


  const filteredUrls = urls?.filter((url)=>{
    return url.title.toLowerCase().includes(searchQuery.toLowerCase());
  })


  return (
    <div className="flex flex-col gap-8">
      {(loading || loadingClicks) && <BarLoader color={"cyan"} width={"100%"} />}

      <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Links Created</CardTitle>
        </CardHeader>

        <CardContent>
          <p>{urls?.length}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Total Click</CardTitle>
        </CardHeader>

        <CardContent>
          <p>{clicks?.length}</p>
        </CardContent>
      </Card>
      </div>


      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-extrabold">My Links</h1>
        {/* <Button>Create New Link</Button> */}

        <CreateLink/>
        
      </div>


      <div className="relative">
        <Input 
        type='text' placeholder="Search Links"
        value={searchQuery}
        onChange={e=> setSearchQuery(e.target.value)}
        />
        <FilterIcon className="absolute top-1/2 right-4 transform -translate-y-1/2" />
      </div>

      {error && <Error message="No links found" />}


      {(filteredUrls || []).map((url, index)=>(
        <LinkCard key={index} url={url} fetchUrls={fnUrls} />
      ))}

      
    </div>
  );
};

export default Dashboard;
