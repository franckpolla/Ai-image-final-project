import React from "react";

const Loader = () => {
  return (
    <div className="inline-flex ml-2">
      <div className="w-4 h-4 rounded-full border-2 border-indigo-200 border-t-indigo-100 animate-spin" />
    </div>
  );
};

export default Loader;
