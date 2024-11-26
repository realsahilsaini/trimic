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

const Header = () => {
  //programmatic navigation
  const naviagte = useNavigate();

  const user = false;

  return (
    <nav className="py-4 flex justify-between items-center">
      <Link to="/">
        <img src="/logo.png" className="h-32" alt="Trimic logo" />
      </Link>

      <div>
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="w-10 bg-red-500 rounded-full overflow-hidden">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>SS</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuLabel>Sahil Saini</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LinkIcon />
                My Links
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-500">
                <LogOut size={16} className="mr-1" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ):

        (
          <Button onClick={() => naviagte("/auth")}>Login</Button>
        )
      
      }
      </div>
    </nav>
  );
};

export default Header;
