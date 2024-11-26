import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { BeatLoader } from "react-spinners";
import Error from "./Error";
import * as Yup from "yup";
import useFetch from "@/hooks/use-fetch";
import { login } from "@/db/apiAuth";
import { useNavigate, useSearchParams } from "react-router-dom";

const Login = () => {

  const navigate = useNavigate();

  let [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const [errors, setErrors] = useState([]);
  const [formData, setFromData] = useState({
    email: "",
    password: "",
  });
  

  const handleInputChange = (e) =>{
    const {name, value} = e.target;

    // console.log(name, value);
    

    setFromData({
      ...formData,

      //Square brackets let you dynamically update the correct field based on the input's name attribute.
      [name]: value
    })
  }


  const {data, error, loading, fn: fnLogin} = useFetch(login, formData);


  const handelLogin = async ()=>{
    setErrors([]);
    try{
      const schema = Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Email is required'),
    
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
      });

      //The abortEarly option tells Yup to stop validation on the first error and return from validate() with the errors found up to that point. If set to false, the entire object will be validated and all errors will be returned.
      await schema.validate(formData, {abortEarly: false});

      //api call
      await fnLogin();
    }catch(error){
      // console.log(error.inner);

      const newErrors = {};  


      // Here innner is an array of errors that are nested inside the object. We can loop through the inner array and get the path and message of each error. We can then set the errors state with the newErrors object.
      error?.inner?.forEach(error => {
        newErrors[error.path] = error.message;
        // console.log(error.path, error.message);
        
      });

      // console.log(newErrors);
      

      setErrors(newErrors);
    }
  }


  
  useEffect(()=>{

    // console.log(data);

    //If there was an longLink in the url while auth, we will redirect the user to the dashboard with the longLink in the query string.
    if(error === null && data){
      navigate(`/dashboard?${longLink ? 
        `createNew=${longLink}` 
        : 
        ""}`);
    }
    

  },[data, error]);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
          to your account if you already have one
            </CardDescription>
            {error && <Error message={error.message}/>}
        </CardHeader>
        <CardContent className="space-y-2" >
        <div className="space-y-1">
          <Input
            name="email"
            type="email"
            placeholder="Enter Email"
            onChange={handleInputChange}
          />
          {errors.email && <Error message={errors.email}/>}
        </div>

        <div className="space-y-1">
          <Input
            name="password"
            type="password"
            placeholder="Enter Password"
            onChange={handleInputChange}
          />
          {errors.password && <Error message={errors.password}/>}
        </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handelLogin}>
            {loading ? <BeatLoader size={10} color="#B2D12D" /> 
            : "Login"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
