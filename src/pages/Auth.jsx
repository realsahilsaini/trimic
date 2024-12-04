import Login from "@/Components/Login";
import Signup from "@/Components/Signup";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { UrlState } from "@/context";
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Auth = () => {
  let [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {isAuthenticated, loading} = UrlState();
  const longLink = searchParams.get("createNew");

  useEffect(() => {
    if (isAuthenticated && !loading)
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
  }, [isAuthenticated, loading, navigate]);
  
  return (
    <div className="flex flex-col items-center gap-10">
      <h1 className="text-5xl font-extrabold">
        {longLink ? "Hold up! Login First..."
          : "Login / Signup"}
      </h1>

      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList  className=" w-full grid grid-cols-2">

          <TabsTrigger value="login">login</TabsTrigger>
          <TabsTrigger value="Signup">Signup</TabsTrigger>

        </TabsList>

        <TabsContent value="login">
          <Login/>
        </TabsContent>

        <TabsContent value="Signup">
          <Signup/>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Auth;
