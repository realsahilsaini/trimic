import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { Copy, Delete, Download, Trash } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { deleteUrl } from "@/db/apiUrl";
import { BeatLoader } from "react-spinners";

const LinkCard = ({ url, fetchUrls }) => {

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


  const {loading, loadingDelete, fn:fnDelete} = useFetch(deleteUrl, url?.id);


  return (
    <div className="flex flex-col justify-around md:flex-row gap-5 border p-4 bg-gray-900 rounded-lg">
      <div className="flex flex-col gap-8 sm:flex-row">
        <img
          src={url?.qr}
          className="h-32 object-contain ring ring-blue-500 self-start rounded-md"
          alt="qr code"
        />

        <Link to={`/link/${url?.id}`} className="flex flex-col flex-1">
          <span className="text-3xl font-extrabold hover:underline cursor-pointer">
            {url?.title}
          </span>

          <span className="text-2xl text-blue-400 font-bold hover:underline cursor-pointer">
            https://trimic.me/
            {url?.custom_url ? url?.custom_url : url?.short_url}
          </span>

          <span className="flex items-center gap-1 hover:underline cursor-pointer">
            {url?.original_url}
          </span>

          <span className="flex items-end font-extralight text-sm flex-1">
            {new Date(url?.created_at).toLocaleString("en-US", {
              hour12: true, // Ensures 12-hour format with AM/PM
            })}
          </span>
        </Link>
      </div>

      <div className="flex gap-2">
        <Button variant='ghost' 
        onClick={() => {
          navigator.clipboard.writeText(`https://trimic.me/${url?.custom_url ? url?.custom_url : url?.short_url}`);
        }}
        >
          <Copy size={16} />
        </Button>
        <Button variant='ghost' onClick={downloadImage}>
          <Download size={16} />
        </Button>
        <Button variant='ghost' onClick={()=>fnDelete().then(()=>fetchUrls())} >
          {loading ? <BeatLoader size={5} color="cyan"/> : <Trash size={16} />}
        </Button>
      </div>
    </div>
  );
};

export default LinkCard;
