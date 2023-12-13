import React, { useState } from "react";
import axios from "axios";

export default function RegisterForm({ setRegistered }) {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    passwordCheck: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (userData.password !== userData.passwordCheck) {
      alert("Passwords do not match. Please try again.");
      return;
    }

    const newUser = {
      username: userData.username,
      email: userData.email,
      password: userData.password,
    };

    axios
      .post("http://localhost:8800/api/register", newUser)
      .then((response) => {
        console.log(response.data);
        alert("Registration successful!");
        setRegistered(true);
      })
      .catch((err) => {
        console.log(err);
        if (
          err.response &&
          err.response.status === 400 &&
          err.response.data.error === "User already exists"
        ) {
          alert(
            "User with the same username or email already exists. Please choose a different username or email."
          );
        } else {
          alert("Registration failed. Please try again.");
        }
      });

    setUserData({
      username: "",
      email: "",
      password: "",
      passwordCheck: "",
    });
  };

  return (
    <div className="mx-auto w-2/3  text-center my-6 p-6 rounded-lg">
      <div className="h-max mx-auto  flex flex-col items-center">
        <form onSubmit={handleSubmit}>
          <div className="border bg-white border-tiara p-24 flex flex-col gap-4 text-sm rounded-lg">
            <p className="mb-4 text-blueFountain text-2xl font-bold text-center">
              Rekisteröidy
            </p>
            <div>
              <label
                className="text-regentGray font-bold inline-block pb-2"
                htmlFor="email"
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
                htmlFor="email"
              >
                Sähköposti
              </label>

              <input
                className="border border-tiara rounded-md w-full shadow-sm px-5 py-2"
                type="email"
                id="email"
                name="email"
                value={userData.email}
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
                required
              />
            </div>
            <div>
              <label
                htmlFor="passwordCheck"
                className="text-regentGray font-bold inline-block pb-2"
              >
                Salasana uudelleen
              </label>
              <input
                type="password"
                id="passwordCheck"
                name="passwordCheck"
                value={userData.passwordCheck}
                onChange={handleChange}
                className="border border-tiara rounded-md w-full shadow-sm px-5 py-2"
                required
              />
            </div>

            <div>
              <input
                className=" bg-blueZodiac w-full py-2 rounded-md text-white font-bold cursor-pointer"
                type="submit"
                value="Rekisteröidy"
              />
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-900 mt-4">
                Onko sinulla jo tili?{" "}
                <button
                  onClick={() => setRegistered(true)}
                  className="text-blueZodiac hover:text-blueFountain transition duration-300 ease-in-out"
                >
                  Kirjaudu sisään
                </button>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
