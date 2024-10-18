import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Setting from "./Setting.jsx";
import { CHECK_AUTH_USER } from "../../Utils/index.js";

import {
  HeaderLogo,
  Account,
  Generate,
  History,
  Home,
  Likes,
} from "../SVG/index.js";

const Header = () => {
  const [auth, setAuth] = useState(false);
  const [openSetting, setOpenSetting] = useState(false);
  const [activeUser, setActiveUser] = useState();

  const navlist = [
    {
      menu: "Home",
      link: "/",
    },
    {
      menu: "Generate",
      link: "/aperture",
    },
    {
      menu: "History",
      link: "/history",
    },
    {
      menu: "Favorite",
      link: "/likes",
    },
    {
      menu: "Account",
      link: "/account",
    },
  ];
  // Function to fetch user details
  const CALL_USER_DETAILS = async () => {
    try {
      const response = await CHECK_AUTH_USER();
      console.log(response);

      console.log(response.credit);
      setActiveUser(response);
    } catch (error) {
      console.log(error);
    }
  };
  // Effect to check authentication status on component mount
  useEffect(() => {
    const storedCookieValue = Cookies.get("token");
    if (storedCookieValue) {
      CALL_USER_DETAILS();
      setAuth(true);
    } else {
      setAuth(false);
    }
  }, []);

  return (
    // Main header container
    <div
      // Mobile: Fixed to bottom, Desktop: Fixed to top
      className="fixed w-screen bottom-0 sm:top-0 z-50 flex flex-row items-center 
    justify-between backdrop-blur bg-opacity-80 border-t
     sm:border-b border-opacity-50 text-sm select-none
      bg-zinc-900 border-t-zinc-700 sm:border-b-zinc-700 "
      style={{ height: 56 }}
    >
      {/* Logo container, hidden on mobile */}
      <a
        href="/"
        className="hidden sm:flex items-center cursor-pointer px-4 pl-6 left-0 h-full w-32"
      >
        <HeaderLogo />
      </a>
      {/* Navigation menu */}

      <div className="flex relative items-center h-full w-full sm:w-auto">
        <nav className="flex flex-row items-center justify-center w-full sm:w-auto">
          {navlist.map((item, index) => {
            return (
              <a
                key={index}
                href={item.link}
                className="flex flex-col sm:flex-row items-center justify-center px-2 sm:px-4 h-full cursor-pointer transition-all"
              >
                <div className="sm:mr-2">
                  {item.menu === "Home" ? (
                    <Home />
                  ) : item.menu === "Generate" ? (
                    <Generate />
                  ) : item.menu === "History" ? (
                    <History />
                  ) : item.menu === "Favorite" ? (
                    <Likes />
                  ) : (
                    <Account />
                  )}
                </div>
                <span className="text-xs sm:text-sm mt-1 sm:mt-0">
                  {item.menu}
                </span>
              </a>
            );
          })}
        </nav>
        {/* User action area */}
        {auth ? (
          <div className="hidden w-32 h-full sm:flex items-center justify-end mr-6">
            <button
              type="button"
              className="h-7 w-auto px-1.5 rounded-full text-xs md:text-sm bg-zinc-800 border border-zinc-700 drop-shadow flex items-center justify-center opacity-80 hover:opacity-100"
              onClick={() => {
                openSetting ? setOpenSetting(false) : setOpenSetting(true);
              }}
            >
              {activeUser?.username.toUpperCase()}
            </button>
            {openSetting && <Setting activeUser={activeUser} />}
          </div>
        ) : (
          <div className="hidden w-32 h-full sm:flex items-center justify-end mr-6">
            <a
              href="/login"
              className="flex items-center justify-center h-8 rounded-md opacity-90 hover:brightness-110 px-4 text-xs md:text-sm bg-gradient-to-t from-indigo-800 via-indigo-800 to-indigo-600 drop-shadow font-medium whitespace-nowrap"
            >
              Get started
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
