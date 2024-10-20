import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import {
  FaInstagram,
  AiOutlineYoutube,
  BsCameraReelsFill,
} from "../Components/SVG/index.js";
import {
  Header,
  GetStarted,
  ImageCard,
  SingleImage,
  ApertImageCard,
  PromptInput,
  Prompt,
  Subscription,
  Button,
  PaymentProssing,
  AIProcessing,
} from "../Components/index.js";

import {
  CHECK_AUTH_USER,
  IMAGE_GENERATOR_V3,
  GET_USER_AI_IMAGES,
} from "../Utils/index.js";

const aperture = () => {
  const [loader, setLoader] = useState(false);
  const [singleID, setSingleID] = useState();
  const [category, setCategory] = useState("Youtube");
  const [error, setError] = useState();

  const [activeUser, setActiveUser] = useState();
  const [allAIImages, setAllAIImages] = useState();
  const [promptv3, setPromptv3] = useState({
    prompt: "",
    negativePrompt: "",
    size: "1024*1024",
    style: "vivid",
  });

  // V3

  const [V3_1024x1024, setV3_1024x1024] = useState([]);
  const [V3_1792x1024, setV3_1792x1024] = useState([]);
  const [V3_1024x1792, setV3_1024x1792] = useState([]);

  const CLICK_V3 = async (promptv3) => {
    try {
      setLoader(true);
      const response = await IMAGE_GENERATOR_V3(promptv3);
      if (response == "data is missing") {
        setError("Data is missing");
        setLoader(false);
        return;
      } else if (response.status == 201) {
        setLoader(false);
        setSingleID(response.data.post._id);
      }
    } catch (error) {
      console.error(error);
      setError(error.message);
      setLoader(false);
    }
  };

  const changeCategory = (category) => {
    if (category == "Reel") {
      setAllAIImages(V3_1024x1792);
      setCategory("Reel");
    } else if (category == "Instagram") {
      setAllAIImages(V3_1024x1024);
      setCategory("Instagram");
    } else if (category == "Youtube") {
      setAllAIImages(V3_1792x1024);
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

  const arrayRender = [...(allAIImages?.reverse() || [])];

  console.log(arrayRender);

  return (
    <div>
      <Header />
      <div className="mb-[56px] sm:mb-0 sm:mt-[56px]">
        <GetStarted />
        <div>
          <div className="w-screen overflow-x-hidden ">
            <div className="flex items-center justify-center w-full mt-8 md:mt-10  ">
              <div className="px-2 md:px-10 lg:px-16 flex items-center flex-col max-w-[1300px ] w-full">
                <div className="w-full flex flex-col-reverse md:flex-row">
                  <Prompt
                    promptv3={promptv3}
                    setPromptv3={setPromptv3}
                    loader={loader}
                    error={error}
                    activeUser={activeUser}
                    generateFunction={() => CLICK_V3(promptv3)}
                  />
                </div>
                <PromptInput
                  promptv3={promptv3}
                  setPromptv3={setPromptv3}
                  loader={loader}
                  error={error}
                  activeUser={activeUser}
                />
                <div
                  className="items-center w-full max-w-[800px] mt-8 px-4 pl-5 md:px-5"
                  style={{ minHeight: "1px", position: "relative" }}
                >
                  <div></div>
                </div>
                <Subscription activeUser={activeUser} />
              </div>
            </div>
            {/* Body */}
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
          </div>
        </div>
      </div>
      {singleID && (
        <SingleImage singleID={singleID} setSingleID={setSingleID} />
      )}
      {loader && <AIProcessing />}
    </div>
  );
};

export default aperture;
