import React, { useState, useEffect } from "react";
import { LoginLogo } from "../SVG/index.js";
import { Loader } from "../index.js";
import { REGISTER_USER, LOGIN_USER } from "../../Utils/index.js";

const PasswordStrengthMeter = ({ password }) => {
  const getStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = getStrength(password);

  const getColor = () => {
    if (strength < 2) return "text-red-500";
    if (strength < 4) return "text-yellow-500";
    return "text-green-500";
  };

  const getLabel = () => {
    if (strength < 2) return "Weak";
    if (strength < 4) return "Medium";
    return "Strong";
  };

  return (
    <div className="password-strength-meter mt-1 text-sm">
      <p>
        Password Strength: <span className={getColor()}>{getLabel()}</span>
      </p>
      {strength < 4 && (
        <ul className="text-xs text-zinc-400 list-disc list-inside mt-1">
          <li>Password should be at least 8 characters long.</li>
          <li>
            Use a combination of uppercase and lowercase letters, numbers, and
            special characters.
          </li>
        </ul>
      )}
    </div>
  );
};

const Auth = () => {
  const [auth, setAuth] = useState(true);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState();
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });
  const [signUp, setSignUp] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validatePassword = (pwd) => {
    return (
      pwd.length >= 8 &&
      /[a-z]/.test(pwd) &&
      /[A-Z]/.test(pwd) &&
      /[0-9]/.test(pwd) &&
      /[^A-Za-z0-9]/.test(pwd)
    );
  };

  const CALLING_REGISTER_USER = async (signUp) => {
    setError("");
    if (!validatePassword(signUp.password)) {
      setError("Password does not meet strength requirements");
      return;
    }
    if (signUp.password !== signUp.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      setLoader(true);
      const user = await REGISTER_USER(signUp);
      if (user) {
        // Handle successful registration
        setLoader(false);
        setError(user.message);
      }
    } catch (error) {
      setError(error.message);
      setLoader(false);
      console.error(error);
    }
  };

  const CALLING_LOGIN_USER = async (login) => {
    try {
      setLoader(true);
      const user = await LOGIN_USER(login);
      if (user) {
        // Handle successful login
        setLoader(false);
        setError(user.message);
      }
    } catch (error) {
      setError(error.message);
      setLoader(false);
      console.error(error);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-zinc-900 bg-opacity-40 z-50"
      style={{ pointerEvents: "auto" }}
    >
      <div
        className="bg-zinc-800 items-center fixed shadow-xl rounded-2xl z-50 px-8 py-8 text-sm border border-zinc-700"
        style={{
          top: "50%",
          transform: "translate(-50%,-50%)",
          left: "50%",
          maxWidth: "330px",
          width: "100%",
          maxHeight: "85vh",
        }}
      >
        <div className="h-auto overflow-hidden">
          <div className="flex flex-col text-zinc-200 text-center items-center">
            <LoginLogo />

            {auth ? (
              <div style={{ marginTop: "1rem" }}>
                <input
                  className="bg-zinc-700 text-zinc-200 rounded-lg p-2 w-full mb-3"
                  placeholder="Email address"
                  required
                  type="email"
                  onChange={(e) =>
                    setLogin({ ...login, email: e.target.value })
                  }
                />
                <input
                  className="bg-zinc-700 text-zinc-200 rounded-lg p-2 w-full mb-3"
                  placeholder="Password"
                  type="password"
                  required
                  onChange={(e) =>
                    setLogin({ ...login, password: e.target.value })
                  }
                />
                <button
                  className="hover:brightness-100 bg-gradient-to-t from-indigo-800 via-indigo-800 to-indigo-700
                  border border-indigo-800 px-4 py-1.5 rounded-lg shadow h-9 w-64
                  drop-shadow flex items-center justify-center mt-3"
                  onClick={() => CALLING_LOGIN_USER(login)}
                >
                  Login {loader && <Loader />}
                </button>
              </div>
            ) : (
              <div style={{ marginTop: "1rem" }}>
                <input
                  className="bg-zinc-700 text-zinc-200 rounded-lg p-2 w-full mb-3"
                  placeholder="Name"
                  type="text"
                  required
                  onChange={(e) =>
                    setSignUp({ ...signUp, username: e.target.value })
                  }
                />
                <input
                  className="bg-zinc-700 text-zinc-200 rounded-lg p-2 w-full mb-3"
                  placeholder="Email address"
                  type="email"
                  required
                  onChange={(e) =>
                    setSignUp({ ...signUp, email: e.target.value })
                  }
                />
                <input
                  className="bg-zinc-700 text-zinc-200 rounded-lg p-2 w-full mb-1"
                  placeholder="Password"
                  type="password"
                  required
                  onChange={(e) =>
                    setSignUp({ ...signUp, password: e.target.value })
                  }
                />
                <PasswordStrengthMeter password={signUp.password} />
                <input
                  className="bg-zinc-700 text-zinc-200 rounded-lg p-2 w-full mb-3 mt-3"
                  placeholder="Confirm Password"
                  type="password"
                  required
                  onChange={(e) =>
                    setSignUp({ ...signUp, confirmPassword: e.target.value })
                  }
                />
                <button
                  className="hover:brightness-100 bg-gradient-to-t from-indigo-800 via-indigo-800 to-indigo-700
                  border border-indigo-800 px-4 py-1.5 rounded-lg shadow h-9 w-64
                  drop-shadow flex items-center justify-center mt-3"
                  onClick={() => CALLING_REGISTER_USER(signUp)}
                >
                  Sign Up {loader && <Loader />}
                </button>
              </div>
            )}
            {error && (
              <p style={{ color: "red", paddingTop: "10px" }}>{error}</p>
            )}

            <button
              onClick={() => setAuth(!auth)}
              className="mt-4 text-indigo-400 hover:text-indigo-300"
            >
              {auth
                ? "Need an account? Sign up"
                : "Already have an account? Log in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
