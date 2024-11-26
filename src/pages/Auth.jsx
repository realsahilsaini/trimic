import Login from "@/Components/Login";
import Signup from "@/Components/Signup";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import { useSearchParams } from "react-router-dom";

const Auth = () => {
  const [searchParams] = useSearchParams();
  
  return (
    <div className="flex flex-col items-center gap-10">
      <h1 className="text-5xl font-extrabold">
        {searchParams.get("createNew")
          ? "Hold up! Login First..."
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
