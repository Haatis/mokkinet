import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { FaHeart, FaUser } from "react-icons/fa";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuthContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSmallDropdownOpen, setIsSmallDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const smallDropDownRef = useRef(null);

  const toggleDropdown = () => {
    if (isSmallDropdownOpen) {
      setIsSmallDropdownOpen(false);
    }
    setIsDropdownOpen(!isDropdownOpen);
  };
  const toggleSmallDropdown = () => {
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
    }
    setIsSmallDropdownOpen(!isSmallDropdownOpen);
  };
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };
  const handleClickOutsideSmall = (event) => {
    if (
      smallDropDownRef.current &&
      !smallDropDownRef.current.contains(event.target)
    ) {
      setIsSmallDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    document.addEventListener("click", handleClickOutsideSmall);

    return () => {
      document.removeEventListener("click", handleClickOutsideSmall);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <div className="bg-blueZodiac text-tiara drop-shadow-md fixed w-full z-30 top-0 ">
      <div className="p-4 flex items-center justify-between lg:mx-8">
        <div className="flex items-center">
          <Link
            to="/"
            className={`text-4xl ${
              location.pathname === "/" ? "border-b-2 border-tiara" : ""
            }`}
          >
            Mökkinet
          </Link>

          <div className="md:ml-2 lg:ml-10 md:text-xl lg:text-2xl mt-1 hidden md:flex  items-center">
            <Link
              to="/cabins"
              className={` md:mx-2 lg:mx-4  ${
                location.pathname === "/cabins" ? "border-b-2 border-tiara" : ""
              }`}
            >
              Mökit
            </Link>

            <Link
              to="/locations"
              className={` md:mx-2 lg:mx-4  ${
                location.pathname === "/locations"
                  ? "border-b-2 border-tiara"
                  : ""
              }`}
            >
              Alueet
            </Link>

            <Link
              to="/about"
              className={` md:mx-2 lg:mx-4 ${
                location.pathname === "/about" ? "border-b-2 border-tiara" : ""
              }`}
            >
              Tietoa
            </Link>
          </div>
        </div>

        <div className="md:ml-2 lg:ml-10 md:text-xl lg:text-2xl mt-1 hidden md:flex  items-center">
          <Link
            to="/addCabin"
            className={` md:mx-2 lg:mx-2 bg-white text-blueZodiac p-1 rounded-xl ${
              location.pathname === "/addCabin" ? "border-b-2 border-tiara" : ""
            }`}
          >
            Ilmoita mökki
          </Link>
          <Link
            to="/favorites"
            className={` md:mx-2 lg:mx-2  border rounded-full p-2`}
          >
            <FaHeart />
          </Link>

          {user ? (
            <>
              <div className="relative inline-block" ref={dropdownRef}>
                <button
                  className={`md:mx-2 lg:mx-2 border rounded-full p-2 focus:outline-none`}
                  onClick={toggleDropdown}
                >
                  <FaUser />
                </button>
                {isDropdownOpen && (
                  <div className="absolute -right-3  mt-2 bg-white border rounded-md shadow-md text-base w-52 p-2 text-blueZodiac">
                    <ul>
                      <li onClick={logout} className="my-2">
                        Kirjaudu ulos ({user.username})
                      </li>
                      <li className="mb-2">
                        {" "}
                        <Link to="/reservations">Omat varaukset</Link>
                      </li>
                      <li>
                        {" "}
                        <Link to="/userCabins">Omat mökit</Link>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="relative inline-block" ref={dropdownRef}>
              <button
                className={`md:mx-2 lg:mx-2 border rounded-full p-2 focus:outline-none`}
                onClick={toggleDropdown}
              >
                <FaUser />
              </button>
              {isDropdownOpen && (
                <div className="absolute -right-3  mt-2 bg-white border rounded-md shadow-md text-base w-52 p-2 text-blueZodiac">
                  <ul>
                    <li className="my-2">
                      <Link to="/login">Kirjaudu sisään</Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
        <button onClick={toggleMenu} className="md:hidden text-3xl">
          {menuOpen ? "X" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden flex justify-center items-center mb-2">
          <Link
            to="/cabins"
            className={`block py-2 px-4 ${
              location.pathname === "/cabins"
                ? "border-b-2 border-tiara md:hidden"
                : "md:hidden"
            }`}
          >
            Mökit
          </Link>
          <Link
            to="/locations"
            className={`block py-2 px-4 ${
              location.pathname === "/locations"
                ? "border-b-2 border-tiara md:hidden"
                : "md:hidden"
            }`}
          >
            Alueet
          </Link>
          <Link
            to="/about"
            className={`block py-2 px-4 ${
              location.pathname === "/about"
                ? "border-b-2 border-tiara md:hidden"
                : "md:hidden"
            }`}
          >
            Tietoa
          </Link>
          <Link
            to="/addCabin"
            className={`block py-2 px-4 ${
              location.pathname === "/addCabin"
                ? "border-b-2 border-tiara md:hidden"
                : "md:hidden"
            }`}
          >
            Ilmoita mökki
          </Link>
          <Link to="/favorites" className={`block py-2 px-4 `}>
            <button className="border rounded-full p-2">
              <FaHeart />
            </button>
          </Link>
          {user ? (
            <div className="relative inline-block" ref={smallDropDownRef}>
              <button
                onClick={toggleSmallDropdown}
                className="border rounded-full p-2"
              >
                <FaUser />
              </button>
              {isSmallDropdownOpen && (
                <div className="absolute -right-3  mt-2 bg-white border rounded-md shadow-md text-base w-52 p-2 text-blueZodiac">
                  <ul>
                    <li onClick={logout}>Kirjaudu ulos ({user.username})</li>
                    <li className="my-2">
                      <Link to="/reservations">Omat varaukset</Link>
                    </li>

                    <li>
                      {" "}
                      <Link to="/userCabins">Omat mökit</Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="block py-2 px-4">
              <button className="border rounded-full p-2">
                <FaUser />
              </button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
