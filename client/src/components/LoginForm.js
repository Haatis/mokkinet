import React, { useState } from "react";
import axios from "axios";
import { useAuthContext } from "../hooks/useAuthContext";

export default function LoginForm({ setRegistered }) {
  const { login } = useAuthContext();
  const [userData, setUserData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:8800/api/login", userData)
      .then((response) => {
        console.log(response.data);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        login(response.data.token, response.data.user);
        alert("Login successful!");
      })
      .catch((err) => {
        console.error(err);
        alert("Login failed. Please check your credentials.");
      });
  };

  return (
    <>
      <div className="mx-auto w-2/3 text-center my-6 p-6 rounded-lg">
        <div className="h-max mx-auto flex flex-col items-center">
          <form onSubmit={handleLogin}>
            <div className="border bg-white border-tiara p-24 flex flex-col gap-4 text-sm rounded-lg">
              <p className="mb-4 text-blueFountain text-2xl font-bold text-center">
                Kirjaudu sisään
              </p>

              <div>
                <label
                  className="text-regentGray font-bold inline-block pb-2"
                  htmlFor="username"
                >
                  Käyttäjätunnus
                </label>

                <input
                  className="border border-tiara rounded-md w-full shadow-sm px-5 py-2"
                  type="text"
                  id="username"
                  name="username"
                  value={userData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label
                  className="text-regentGray font-bold inline-block pb-2"
                  htmlFor="password"
                >
                  Salasana
                </label>
                <input
                  className="border border-tiara rounded-md w-full shadow-sm px-5 py-2"
                  type="password"
                  id="password"
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                />
              </div>

              <div>
                <input
                  className=" bg-blueZodiac w-full py-2 rounded-md text-white font-bold cursor-pointer"
                  type="submit"
                  value="Kirjaudu sisään"
                />
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-900 mt-4">
                  Jos ei sinulla ole tiliä{" "}
                  <button
                    onClick={() => setRegistered(false)}
                    className="text-blueZodiac hover:text-blueFountain transition duration-300 ease-in-out"
                  >
                    Rekisteröidy
                  </button>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
