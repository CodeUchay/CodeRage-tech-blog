import React, { useEffect, useState } from "react";

import { MdDarkMode } from "react-icons/md";
import { GiFireDash } from "react-icons/gi";
import { Link } from "react-router-dom";
import { ThemeContext } from "../theme";
import { useContext } from "react";
import { GiHamburgerMenu } from 'react-icons/gi'
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const { isDarkMode, toggleDarkMode, baseURL } = useContext(ThemeContext);
  const bgColor = isDarkMode ? "slate-950" : "white";
  const textColor = isDarkMode ? "white" : "black";
  document.body.style.backgroundColor = isDarkMode ? "rgb(2 6 23)" : "white";
  
  const { userInfo, setUserInfo } = useContext(UserContext);
  const navigate = useNavigate();
 
  useEffect(() => {
    fetch(baseURL + "/profile", {
      method: "GET",
      credentials: 'include',
      
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }
        return response.json();
      })
      .then((data) => {
        setUserInfo(data);
      })
      .catch((error) => {
        console.error(error);
        // Handle the error here, such as redirecting to a login page
      });
  }, []);
  

  const email = userInfo?.email
  const username = userInfo?.username
  // State to control the hamburger menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to toggle the hamburger menu state
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  function logout() {
    setIsMenuOpen(false);
  
    fetch(baseURL + '/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Set the content type header
      },
      credentials: 'include',
    })
      .then(() => {
        setUserInfo(null);
        navigate('/'); // Trigger the redirect after logout
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  }
  
  return (
    <div
      className={`container fixed mx-auto text-${textColor} bg-white top-0 left-0 right-0 z-10`}
    >
      <div className={`flex justify-between h-20 px-10 lg:px-24 bg-${bgColor}`}>
        <Link
          to="/"
          className="flex justify-center items-center gap-1 cursor-pointer"
        >
          <GiFireDash size={25} className="text-purple-500"></GiFireDash>
          <span className={`text-2xl font-semibold font-AcmeRegular text-purple-500 `}>CodeRage</span>
        </Link>
        <div className="flex justify-center items-center gap-3 lg:gap-5">
        <MdDarkMode
            size={20}
            onClick={toggleDarkMode}
            className={`text-${textColor} cursor-pointer lg:mr-6`}
          />
          {email ? (
            <>
            <div className="hidden lg:flex md:gap-5 md:justify-center md:items-center">
            <h1 className=" text-sm text-gray-400">User: {username}</h1><Link to="/addpost">
            <button className=" bg-purple-600 p-3 text-white hover:bg-purple-700 rounded">Add Post</button>
          </Link>
          
            <button onClick={logout} className=" text-red-500  border border-red-500 hover:bg-red-600 hover:text-white p-3 rounded">LogOut</button>
         
          </div>
          
            <GiHamburgerMenu
              className=" cursor-pointer focus:none  text-2xl lg:hidden"
              onClick={toggleMenu}
            >
            </GiHamburgerMenu>
            </>
          ) : (
            <>
              <Link to="/Login">
                <button className="text-purple-600 hover:text-purple-600 hover:underline">Login</button>
              </Link>
              <Link to="/Register">
                <button className="text-purple-600  hover:text-purple-600 hover:underline">Register</button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Hamburger menu content */}
      {isMenuOpen && (
        <div className={`{px-4 py-2 bg-${bgColor} lg:hidden`}>
          <div className={`mx-8 p-3 flex flex-col gap-4 `}>
          <h1 className="text-sm -mt-6 text-gray-400">User: {username}</h1>
            <Link to={'/addpost'}  onClick={()=> setIsMenuOpen(false)} ><button className="block w-full p-3 text-white bg-purple-500 rounded hover:bg-purple-600 hover:text-white">
              Add Post
            </button>
            </Link>
            <button onClick={logout} className="block w-full mt-2 text-red-500  border border-red-500 hover:bg-red-600 hover:text-white p-3 rounded">
              Logout
            </button></div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
