import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { SearchIcon, BsCameraReelsFill } from "../Components/SVG/index.js";
import { Header, GetStarted, Button, ImageCard } from "../Components/index.js";
import { CHECK_AUTH_USER, GET_AI_USER_IMAGES } from "../Utils/index.js";

const History = () => {
  const [category, setCategory] = useState("Reel");
  const [activeUser, setActiveUser] = useState();
  const [allAIImages, setAllAIImages] = useState([]);
  const [allPostCopy, setAllPostCopy] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [singleID, setSingleID] = useState();

  const [V3_1024x1024, setV3_1024x1024] = useState([]);
  const [V3_1792x1024, setV3_1792x1024] = useState([]);
  const [V3_1024x1792, setV3_1024x1792] = useState([]);

  const changeCategory = (category) => {
    if (category === "Reel") {
      setAllAIImages(V3_1024x1792);
      setAllPostCopy(V3_1024x1792);
      setCategory("Reel");
    } else if (category === "Instagram") {
      setAllAIImages(V3_1024x1024);
      setAllPostCopy(V3_1024x1024);
      setCategory("Instagram");
    } else if (category === "Youtube") {
      setAllAIImages(V3_1792x1024);
      setAllPostCopy(V3_1792x1024);
      setCategory("Youtube");
    }
  };

  const Get_User = async () => {
    const storedCookieValue = Cookies.get("token");
    if (storedCookieValue) {
      const user = CHECK_AUTH_USER();
      const response = await GET_AI_USER_IMAGES();
      setActiveUser(user);
      const V3_1024x1024Temp = [];
      const V3_1792x1024Temp = [];
      const V3_1024x1792Temp = [];
      response.forEach((element) => {
        if (element.size === "1024x1792") {
          V3_1024x1792Temp.push(element);
        } else if (element.size === "1024x1024") {
          V3_1024x1024Temp.push(element);
        } else if (element.size === "1792x1024") {
          V3_1792x1024Temp.push(element);
        }
      });

      setV3_1024x1792(V3_1024x1792Temp);
      setV3_1024x1024(V3_1024x1024Temp);
      setV3_1792x1024(V3_1792x1024Temp);
      setAllAIImages(V3_1024x1792Temp);
      setAllPostCopy(V3_1024x1792Temp);
    }
  };

  useEffect(() => {
    Get_User();
  }, []);

  const handleSearch = () => {
    const filterPosts = allPostCopy.filter(({ prompt }) =>
      prompt.toLowerCase().includes(searchItem.toLowerCase())
    );
    setAllAIImages(filterPosts);
  };

  const onClearSearch = () => {
    setSearchItem("");
    setAllAIImages(allPostCopy);
  };

  return (
    <div>
      <Header />
      <div className="mb-[56px] sm:mb-0 sm:mt-[56px]">
        <div className="flex flex-col ">
          <GetStarted />
          <div className="w-screen overflow-x-hidden flex flex-col items-center py-4 mt-16">
            <a
              href="/history"
              className="text-5xl sm:text-6xl md:text-7xl mb-8 font-logo font-bold mt-0 text-center"
            >
              History
            </a>

            <div className="flex items-center justify-center w-full max-w-[500px] px-4 pl-5 md:px-5">
              <div className="flex w-full justify-center">
                <div className="w-full">
                  <div className="w-full flex items-center relative">
                    <SearchIcon />
                    <input
                      className="bg-zinc-700 flex-1 pl-12 pr-12 rounded-full text-sm px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-700"
                      placeholder="Search for an image"
                      value={searchItem}
                      onChange={(e) => setSearchItem(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mb-8">
                  <button
                    type="button"
                    onClick={handleSearch}
                    className="w-32 mx-4 sm:w-36 flex items-center justify-center text-sm font-semibold text-white h-10 rounded-full 
             bg-gradient-to-r from-indigo-600 to-indigo-800 
             hover:from-indigo-200 hover:to-indigo-900
             transition-all duration-200 ease-in-out
             shadow-md hover:shadow-lg
             focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50
             transform hover:scale-105"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
            {allAIImages?.length ? (
              <div className="flex space-x-2 px-2">
                <Button
                  icon={<BsCameraReelsFill />}
                  name="Reel"
                  handleClick={() => changeCategory("Reel")}
                  category={category}
                />
                <Button
                  icon={<BsCameraReelsFill />}
                  name="Youtube"
                  handleClick={() => changeCategory("Youtube")}
                  category={category}
                />
                <Button
                  icon={<BsCameraReelsFill />}
                  name="Instagram"
                  handleClick={() => changeCategory("Instagram")}
                  category={category}
                />
                <div className="mt-2">&nbsp;</div>
                <div className="mt-3 relative px-2 md:px-7 w-full">
                  <div
                    className="active:outline-none focus:outline-none overflow-hidden new-css-style-box"
                    role="grid"
                    tabIndex={0}
                    style={{
                      position: "relative",
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(200px, 1fr))",
                      listStyle: "none",
                      margin: "0",
                      padding: "0",
                    }}
                  >
                    {allAIImages.map((image, index) => (
                      <div key={image.id || index}>
                        <ImageCard
                          index={index}
                          item={image}
                          setSingleID={setSingleID}
                          activeUser={activeUser}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center px-10 text-sm mt-4 text-zinc-400">
                <p>
                  Your Camera roll is empty.
                  <a href="/aperture" className="underline">
                    {" "}
                    Generate images
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
