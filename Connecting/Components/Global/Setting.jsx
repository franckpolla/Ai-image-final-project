import React from "react";
import { LOG_OUT_USER } from "../../Utils/index.js";
import { IoLogInOutline } from "../SVG/index.js";

const Setting = ({ activeUser }) => {
  return (
    <div
      className="w-64 bg-zinc-800 z-50 fixed right-0 top-5 rounded-md drop-shadow shadow text-sm flex flex-col items-start overflow-hidden border border-zinc-700 sliderDownAndFade divide-y divide-zinc-700"
      style={{ marginRight: "1rem", marginTop: "2rem" }}
    >
      <div className="px-4 py-2 bg-zinc-700 bg-opacity-50 w-full">
        <div className="flex items-center">
          <div className="rounded-full h-8 px-2 flex-shrink-0 w-auto flex items-center justify-center bg-zinc-800 mr-2">
            <p>{activeUser?.username.toLowerCase()}</p>
          </div>
        </div>
        <span className="text-center flex justify-center items-center font-medium truncate">
          {activeUser?.email}
        </span>
        <a className="w-full px-4 py-2 hover:bg-zinc-700 flex text-white justify-center items-center">
          Credit left &nbsp; <IoLogInOutline /> &nbsp; {activeUser?.credit}
        </a>
        <hr />
        <a
          className="w-full px-4 py-2 hover:bg-zinc-700 flex justify-center"
          href="/account"
        >
          Buy Credit
        </a>
        <hr />
        <button
          className="w-full px-4 py-2 hover:bg-zinc-700"
          onClick={() => LOG_OUT_USER()}
        >
          Sign Out
        </button>
        <hr />
      </div>
    </div>
  );
};

export default Setting;
