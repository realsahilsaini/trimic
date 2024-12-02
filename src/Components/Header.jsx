import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link2, Link2Icon, LinkIcon, LogOut } from "lucide-react";
import { UrlState } from "@/context";
import useFetch from "@/hooks/use-fetch";
import { logout } from "@/db/apiAuth";
import { BarLoader } from "react-spinners";

const Header = () => {
  //programmatic navigation
  const navigate = useNavigate();

   const {user, fetchUser} = UrlState();

  //  console.log(user);
    
   const {loading, fn: fnLogout} = useFetch(logout);

  return (

    <>
    <nav className="py-4 flex justify-between items-center">
      <Link to="/">
        <img src="/logo.png" className="h-32" alt="Trimic logo" />
      </Link>

      <div>
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="w-10 rounded-full overflow-hidden">
              <Avatar>
                <AvatarImage src={user.user_metadata.profile_pic} className='object-cover' />
                <AvatarFallback>Avatar</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuLabel>{user?.user_metadata?.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to={'/dashboard'} className="flex gap-2">
                <LinkIcon />
                My Links
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-500">
                <LogOut size={16} className="mr-1" />
                <span 
                onClick={() => {
                  fnLogout().then(() => {
                    fetchUser();
                    navigate("/");
                  });
                }}
                >
                  Logout
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
        
        :

        (
          <Button onClick={() => navigate("/auth")}>Login</Button>
        )
      
      }
      </div>
    </nav>
    {loading && <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />}
    </>

  );
};

export default Header;
