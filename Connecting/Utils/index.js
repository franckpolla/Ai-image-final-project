import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPEN_AI_KEY,
  dangerouslyAllowBrowser: true,
});

export const REGISTER_USER = async (signup) => {
  const { name, email, password, comfirmPassword } = signup;

  if (password !== comfirmPassword) {
    throw new Error("Passwords do not match");
  }
  if (!name || !email || !password || !comfirmPassword) {
    throw new Error("All fields are required");
  }
  try {
    const response = await axios.post("/api/auth/register", {
      data: { name, email, password },
    });
    if (response.status == 200) {
      window.location.href("/");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

export const LOGIN_USER = async (login) => {
  const { email, password } = login;
  if (!email || !password) {
    throw new Error("All fields are required");
  }

  try {
    const response = await axios.post("/api/auth/login", {
      data: { email, password },
    });
    if (response.status == 200) {
      window.location.href("/");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

export const LOG_OUT_USER = async () => {
  try {
    const response = await axios.get("/api/auth/logout");
    if (response.status == 200) {
      window.location.href("/api/auth/login");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

export const CHECK_AUTH_USER = async () => {
  try {
    const response = await axios.get(`/api/auth/refetch`);
    let user;
    if (response.status == 200) {
      user = response.data;
    }
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const LIKE_POST = async (postID) => {
  const currentUser = CHECK_AUTH_USER();

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
  const currentUser = CHECK_AUTH_USER();
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
  const currentUser = CHECK_AUTH_USER();
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
    const currentUser = CHECK_AUTH_USER();
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
