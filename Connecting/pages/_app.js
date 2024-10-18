import "../styles/globals.css";
//this is the layout of the main index page
import React, { useState, useEffect } from "react";
import Head from "next/head";
import Cookies from "js-cookie";
// import Auth from "../../Connecting/Components/Global/Auth.jsx";

import { Auth } from "../Components/index.js";
export default function App({ Component, pageProps }) {
  const [auth, setAuth] = useState(false);
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setAuth(true);
    } else {
      setAuth(false);
    }
  }, []);
  return (
    <>
      <Head>
        <title>HAHO AI Image </title>
        <meta
          name="description"
          content="AI Image Generator powered by OpenAI"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="180x180"
          href="/assets/Brain_tech.png"
        />
      </Head>
      {!auth && <Auth />}
      <Component {...pageProps} />
    </>
  );
}
