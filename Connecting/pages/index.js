import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import {
  HomeLogo,
  SearchIcon,
  Image,
  Filter,
  FaHeart,
  FaInstagram,
  AiOutlineYoutube,
  BsCameraReelsFill,
  FaRegHeart,
  Magic,
} from "../Components/SVG/index.js";
import {
  Header,
  GetStarted,
  ImageCard,
  SingleImage,
  ApertImageCard,
  Notic,
  Button,
  PaymentProssing,
} from "../Components/index.js";

import { CHECK_AUTH_USER, GET_AI_IMAGES } from "../Utils/index.js";

const index = () => {
  const { query } = useRouter(); // here we are extracting the query from the router
  const [loader, setLoader] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [buying, setBuying] = useState();
  const [first, setFirst] = useState("");
  const [singleID, setSingleID] = useState();
  const [category, setCategory] = useState("Reel");

  const [activeUser, setActiveUser] = useState();
  const [allAIImages, setAllAIImages] = useState();
  const [allPostCopy, setAllPostCopy] = useState([]);

  const [Search, setSearch] = useState("");
  const [searchItem, setSearchItem] = useState("");

  // V3

  const [V3_1024x1024, setV3_1024x1024] = useState([]);
  const [V3_1792x1024, setV3_1792x1024] = useState([]);
  const [V3_1024x1792, setV3_1024x1792] = useState([]);

  useEffect(() => {
    if (query.CREDIT_PLAN) {
      setBuying(query.CREDIT_PLAN);
    }
  }, [query.CREDIT_PLAN]);

  const changeCategory = (category) => {
    if (category == "Reel") {
      setAllAIImages(V3_1024x1792);
      setAllPostCopy(V3_1024x1792);
      setCategory("Reel");
    } else if (category == "Instagram") {
      setAllAIImages(V3_1024x1024);
      setAllPostCopy(V3_1024x1024);
      setCategory("Instagram");
    } else if (category == "Youtube") {
      setAllAIImages(V3_1792x1024);
      setAllPostCopy(V3_1792x1024);
      setCategory("Youtube");
    }
  };

  const Get_User = async () => {
    const storedCookieValue = Cookies.get("token");
    if (storedCookieValue) {
      const user = await CHECK_AUTH_USER();
      console.log(user);
      setActiveUser(user);
    }
  };
  const CALLING_ALL_POSTS = async () => {
    try {
      const response = await GET_AI_IMAGES();

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
      Get_User();
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    CALLING_ALL_POSTS();
  }, []);

  // we are checking the entered value from the different prompts
  const handleSearch = (value) => {
    const filterPosts = allAIImages?.filter(({ prompt }) => {
      prompt.toLowerCase().includes(value.toLowerCase());
    });
    if (filterPosts.length === 0) {
      setAllAIImages(allPostCopy);
    } else {
      setAllAIImages(filterPosts);
    }
  };
  const onClearSearch = () => {
    if (allAIImages?.length && allPostCopy?.length) {
      setAllAIImages(allPostCopy);
    }
  };
  // debounce onSearch method
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchItem), 1000);
    return () => clearTimeout(timer);
  }, [searchItem]);

  useEffect(() => {
    if (Search) {
      handleSearch(Search);
    } else {
      onClearSearch();
    }
  }, [Search]);

  const arrayRender = [...(allAIImages?.reverse() || [])];

  console.log(arrayRender);

  return (
    <div>
      <Header />
      <div className="mb-[56px] sm:mb-0 sm:mt-[56px]">
        <div className="flex flex-col ">
          <GetStarted />
          <div className="w-screen overflow-x-hidden flex flex-col items-center py-4 mt-16">
            <a href="/">
              <HomeLogo />
            </a>
            <a href="/aperture" className="cursor-pointer">
              <p className="mt-2 text-xs text-indigo-300 active:scale-95 text-center font-medium shadow-sm hover:shadow-md bg-indigo-300 bg-opacity-5 hover:bg-opacity-10 border border-indigo-300 border-opacity-10 hover:border-opacity-20 transition-all rounded-md px-6 py-2">
                AI Image DALL·E 3 is here !
              </p>
            </a>
            <div className="flex items-center justify-center w-full max-w-[600px] md:ml-[48px] mt-8 px-4 pl-5 md:px-5">
              <div className="flex w-full">
                <div className="w-full">
                  <div
                    className="w-full flex items-center relative"
                    role="button"
                    tabIndex={0}
                    onClick={() => changeCategory("Filter")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        changeCategory("Filter");
                      }
                    }}
                  >
                    <SearchIcon />
                    <input
                      className="bg-zinc-700 flex-1 pl-12 pr-12 rounded-full text-sm px-4 py-2.5 focus:outline-none focus:ring-1  focus:ring-indigo-700"
                      placeholder="Search for an image"
                      value={searchItem}
                      onChange={(e) => setSearchItem(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-center">
                  <button
                    type="button"
                    className="ml-2 h-10 w-10 rounded-full cursor-pointer flex items-center justify-center bg-transparent hover:bg-zinc-900"
                  >
                    <Image />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      openFilter ? setOpenFilter(false) : setOpenFilter(true)
                    }
                    className="ml-2 h-10 w-10 rounded-full cursor-pointer flex items-center justify-center bg-transparent hover:bg-zinc-900"
                  >
                    <Filter />
                  </button>
                </div>
              </div>
            </div>
            <div
              className="flex w-full max-w-[600px] md:ml-[48px] mt-2 px-4 pl-5 md:px-5"
              style={{
                position: "relative",
              }}
            />
            {openFilter && <Notic />}
            <div className="mb-8 flex-col items-center">
              <div className="flex space-x-2">
                <button
                  type="button"
                  className="w-32 sm:w-36 flex items-center text-xs justify-center text-center
                 h-9 rounded-full hover:brightness-110 bg-opacity-0 shadow-sm mt-4 bg-gradient-to-t from-indigo-900 via-indigo-900 to-indigo-900"
                >
                  Search
                </button>
                <a href="/aperture">
                  <button
                    type="button"
                    className="w-32 sm:w-36 flex items-center text-xs justify-center text-center
                 h-9 rounded-full hover:brightness-110 bg-opacity-0 shadow-sm mt-4 border border-gray-700 hover:bg-zinc-700"
                  >
                    Generate
                  </button>
                </a>
              </div>
            </div>
            <div className="flex space-x-2 px-2">
              <Button
                icon={<BsCameraReelsFill />}
                name={"Reel"}
                handleClick={() => changeCategory("Reel")}
                category={category}
              />
              <Button
                icon={<BsCameraReelsFill />}
                name={"Youtube"}
                handleClick={() => changeCategory("Youtube")}
                category={category}
              />
              <Button
                icon={<BsCameraReelsFill />}
                name={"Instagram"}
                handleClick={() => changeCategory("Instagram")}
                category={category}
              />
            </div>

            <div className="mt-2">&nbsp;</div>
            <div className="mt-3 relative px-2 md:px-  w-full">
              <div
                className="active:outline-none focus:outline-none overflow-hidden
                new-css-style-box"
                role="grid"
                tabIndex={0}
                style={{
                  position: "relative",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr)",
                  listStyle: "none",
                  margin: "0",
                  padding: "0",
                  gap: ".1rem",
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      {buying && <PaymentProssing buying={buying} setBuying={setBuying} />}
    </div>
  );
};

export default index;
