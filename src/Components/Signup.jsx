import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { BeatLoader } from "react-spinners";
import Error from "./Error";
import * as Yup from "yup";
import useFetch from "@/hooks/use-fetch";
import { signup } from "@/db/apiAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import {UrlState} from "@/context";

const Signup = () => {

  const navigate = useNavigate();

  let [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const [errors, setErrors] = useState([]);
  const [formData, setFromData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: null,
  });
  

  const handleInputChange = (e) =>{
    const {name, value, files} = e.target;

    // console.log(name, value);
    

    setFromData({
      ...formData,

      //Square brackets let you dynamically update the correct field based on the input's name attribute.
      [name]: files? files[0] : value
    })
  }


  const {data, error, loading, fn: fnSignup} = useFetch(signup, formData);

  const handleSignup = async ()=>{
    setErrors([]);
    try{
      const schema = Yup.object().shape({
        name: Yup.string().required('Email is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
    
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        
        profile_pic: Yup.mixed().required('Profile Picture is required'),
      });

      //The abortEarly option tells Yup to stop validation on the first error and return from validate() with the errors found up to that point. If set to false, the entire object will be validated and all errors will be returned.
      await schema.validate(formData, {abortEarly: false});

      //api call
      await fnSignup();
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


const {fetchUser} = UrlState();
  
  useEffect(()=>{

    //If there was an longLink in the url while auth, we will redirect the user to the dashboard with the longLink in the query string.
    //Successfully logged in
    if (error === null && data) {
      fetchUser();
      // console.log(data);
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
    }
    

  },[data, error, loading]);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Signup</CardTitle>
          <CardDescription>
          Create an account to get started
            </CardDescription>
            {error && <Error message={error.message}/>}
        </CardHeader>
        <CardContent className="space-y-2" >

        <div className="space-y-1">
          <Input
            name="name"
            type="text"
            placeholder="Enter name"
            onChange={handleInputChange}
          />
          {errors.name && <Error message={errors.name}/>}
        </div>

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

        <div className="space-y-1">
          <Input
            name="profile_pic"
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="border-none bg-gray-800/30"
          />
          {errors.profile_pic && <Error message={errors.profile_pic}/>}
        </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSignup}>
            {loading ? <BeatLoader size={10} color="#B2D12D" /> 
            : "Create Account"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
