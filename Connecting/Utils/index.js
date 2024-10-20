import OpenAI from "openai";
import axios from "axios";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPEN_AI_KEY,
  dangerouslyAllowBrowser: true,
});

export const REGISTER_USER = async (signup) => {
  const { username, email, password, confirmPassword } = signup;

  if (!username || !email || !password || !confirmPassword) {
    throw new Error("All fields are required");
  }

  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  try {
    const response = await axios.post("/api/auth/register", {
      username,
      email,
      password,
    });

    console.log(response.data);
    if (response.status === 201) {
      window.location.href = "/";
    }
    return response.data.user;
  } catch (error) {
    console.error(error.response?.data?.message || error.message);
    throw new Error(
      error.response?.data?.message || "An error occurred during registration"
    );
  }
};

export const LOGIN_USER = async (login) => {
  const { email, password } = login;

  if (!email || !password) {
    throw new Error("All fields are required");
  }

  try {
    const response = await axios.post("/api/auth/login", {
      email,
      password,
    });

    console.log(response.data);
    if (response.status === 200) {
      window.location.href = "/";
    }
    return response.data;
  } catch (error) {
    console.error(error.response?.data?.message || error.message);
    throw new Error(
      error.response?.data?.message || "An error occurred during login"
    );
  }
};
export const LOG_OUT_USER = async () => {
  try {
    const response = await axios.post("/api/auth/logout");
    if (response.status == 200) {
      window.location.href = "/login";
    }
  } catch (error) {
    console.error(error.response?.data?.message || error.message);
    throw error;
  }
};

// this function  is called to get the actual user
export const CHECK_AUTH_USER = async () => {
  try {
    const response = await axios.get(`/api/auth/refetch`);
    let userDetail;
    if (response.status == 200) {
      userDetail = response.data.user;
      console.log(userDetail);
    }
    return userDetail;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const LIKE_POST = async (postID) => {
  const currentUser = await CHECK_AUTH_USER();

  if (!currentUser) {
    throw new Error("You must be logged in to like a post");
  }

  try {
    const response = await axios.post(
      `/api/post/like/${postID}/${currentUser._id}`,
      {
        data: { user: currentUser._id },
      }
    );
    if (response.status == 200) {
      return response;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

export const DISLIKE_POST = async (postID) => {
  const currentUser = await CHECK_AUTH_USER();
  if (!currentUser) {
    throw new Error("You must be logged in to dislike a post");
  }
  try {
    const response = await axios.post(
      `/api/post/dislike/${postID}/${currentUser._id}`,
      {
        data: {
          user: currentUser._id,
        },
      }
    );
    if (response.status == 200) {
      return response;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

export const IMAGE_GENERATOR_V3 = async (promptv3) => {
  const currentUser = await CHECK_AUTH_USER();
  if (!currentUser || !currentUser._id) {
    throw new Error("User authentication failed");
  }
  const { prompt, negativePrompt, size, style } = promptv3;
  if (!prompt || !negativePrompt || !size || !style) return " data is missing ";

  const LOWERCASE = style.toLowerCase();

  const image = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt.toLowerCase(),
    n: 1,
    quality: "hd",
    size: size,
    style: LOWERCASE,
  });
  if (!image) {
    throw new Error("Failed to generate image");
  }
  const imageUrl = image.data[0].url;

  if (imageUrl) {
    const currentUser = await CHECK_AUTH_USER();
    try {
      const response = await axios.post(
        `/api/post/create/v3/${currentUser._id}`,
        {
          data: {
            prompt,
            negativePrompt: negativePrompt,
            revisedPrompt: image.data[0].revised_prompt,
            size,
            style,
            imageURL: imageUrl,
            prompt: prompt,
          },
        }
      );
      if (response.status == 201) {
        const updateCreditResponse = await axios.put(
          `/api/user/credit/${currentUser._id}`,
          {
            data: {
              credit: Number(currentUser.credit) - 1,
            },
          }
        );
        return updateCreditResponse;
      }
    } catch (error) {
      console.error(error.message);
    }
  }
};

export const GET_AI_IMAGES = async () => {
  try {
    const response = await axios.get("/api/post/all");
    if (response.status === 200) {
      return response.data.posts;
    }
  } catch (error) {
    console.error(error.message);
  }
};
export const GET_AI_USER_IMAGES = async () => {
  const currentUser = await CHECK_AUTH_USER();
  try {
    const response = await axios.get(`/api/post/user/${currentUser._id}`);
    if (response.status === 200) {
      return response.data.posts;
    }
  } catch (error) {
    console.error(error.message);
  }
};
export const GET_SINGLE_POST = async (postID) => {
  try {
    const response = await axios.get(`/api/post/single/${postID}`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error(error.message);
  }
};
export const DELETE_POST = async (postID) => {
  try {
    const response = await axios.delete(`/api/post/delete/${postID}`);
    if (response.status === 200) {
      return "the post has been deleted ";
    }
  } catch (error) {
    console.error(error.message);
  }
};
export const BUYING_CREDIT = async (CREDIT) => {
  const currentUser = await CHECK_AUTH_USER();
  try {
    const response = await axios.put(`/api/user/credit/${currentUser._id}`, {
      data: {
        credit: Number(currentUser?.credit) + Number(CREDIT),
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error(error.message);
  }
};
