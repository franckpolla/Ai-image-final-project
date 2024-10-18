import React, { useEffect, useState } from "react";
import Setting from "./Setting.jsx";
import Cookies from "js-cookie";
import { CHECK_AUTH_USER } from "../../Utils/index.js";

const GetStarted = () => {
  const [auth, setAuth] = useState(false);
  const [openSetting, setOpenSetting] = useState(false);
  const [activeUser, setActiveUser] = useState(null);

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
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      CALL_USER_DETAILS();
      setAuth(true);
    } else {
      setAuth(false);
    }
  }, []);

  return (
    <>
      {auth ? (
        <div className="sm:hidden absolute w-full flex items-center justify-end top-2 right-2">
          <button
            onClick={() => {
              openSetting ? setOpenSetting(false) : setOpenSetting(true);
            }}
            className="h-8 w-auto px-2 text-white rounded-full text-xs md:text-sm bg-zinc-800 border border-zinc-700 drop-shadow flex items-center justify-center opacity-80 hover:opacity-100"
            type="button"
          >
            {activeUser?.username.toUpperCase()}
          </button>
          {openSetting && <Setting activeUser={activeUser} />}
        </div>
      ) : (
        <div className="sm:hidden absolute w-full flex items-center justify-end top-2 right-2">
          <a
            href="/login"
            className="flex items-center justify-center
          hover:brightness-110 p-4 text-xs md:text-cm bg-gradient-to-t from-indigo-700 
          to-indigo-600 drop-shadow  whitespace-nowrap
          opacity-90 font-bold  rounded-xl h-8"
          >
            Get started
          </a>
        </div>
      )}
    </>
  );
};

export default GetStarted;
