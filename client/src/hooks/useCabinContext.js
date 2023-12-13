import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CabinContext = createContext();

export const useCabinContext = () => {
  return useContext(CabinContext);
};

export const CabinProvider = ({ children }) => {
  const [cabins, setCabins] = useState([]);

  useEffect(() => {
    const fetchAllCabins = async () => {
      try {
        const response = await axios.get("http://localhost:8800/api/cabins");
        setCabins(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllCabins();
  }, []);

  return (
    <CabinContext.Provider value={{ cabins, setCabins }}>
      {children}
    </CabinContext.Provider>
  );
};
