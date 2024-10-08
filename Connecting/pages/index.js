import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import {
  HomeLogo,
  Search,
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

  const changecategory = (category) => {
    if (category == "Reel") {
      setAllAIImages(V3_1024x1792);
      setAllPostCopy(V3_1024x1792);
      setCategory("Reel");
    } else if (category == "Instagram") {
      setAllAIImages(V3_1024x1024);
      setAllPostCopy(V3_1024x1024);
      setCategory("Reel");
    } else if (category == "Youtube") {
      setAllAIImages(V3_1792x1024);
      setAllPostCopy(V3_1792x1024);
      setCategory("Reel");
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

      const storedCookieValue = Cookie.get("token");
      if (storedCookieValue) {
        const user = CHECK_AUTH_USER();
        setActiveUser(user);
      }
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

  return <div>hello world</div>;
};

export default index;
