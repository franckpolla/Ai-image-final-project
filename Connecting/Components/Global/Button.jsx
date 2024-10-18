import React from "react";

const Button = ({ icon, name, handleClick, category }) => {
  const baseClasses = `
    text-xs rounded-md sm:text-sm group mt-4 whitespace-nowrap flex-1 flex 
    select-none cursor-pointer hover:brightness-110 bg-gradient-to-t
    w-fit-content justify-center items-center px-2.5 drop-shadow py-2.5
  `;

  const activeClasses =
    "from-indigo-900 via-indigo-900 to-indigo-800 active:scale-95 transition-all";
  const inactiveClasses = "from-zinc-700 via-zinc-700 to-zinc-700";

  return (
    <button
      onClick={handleClick}
      className={`${baseClasses} ${
        category === name ? activeClasses : inactiveClasses
      }`}
    >
      {icon} &nbsp; &nbsp;{name}
    </button>
  );
};

export default Button;
