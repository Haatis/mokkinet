import React from "react";

const NumberInput = ({ label, count, setCount }) => {
  const handleIncrement = () => {
    if (count < 10) {
      setCount(count + 1);
    }
  };

  const handleDecrement = () => {
    if (label === "tähteä") {
      if (count > 0) {
        setCount(count - 1);
      }
    } else if (count > 1) {
      setCount(count - 1);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <button
        className="border border-tiara rounded-l-md w-1/6 shadow-sm py-2 focus:outline-none"
        onClick={handleDecrement}
      >
        -
      </button>
      {label === "tähteä" && count === 0 ? (
        <div className="border border-tiara w-full rounded-none shadow-sm px-2 py-2 flex items-center justify-center">
          Min. tähtimäärä
        </div>
      ) : (
        <div className="border border-tiara w-full rounded-none shadow-sm px-2 py-2 flex items-center justify-center">
          {count} {label}
        </div>
      )}

      <button
        className="border border-tiara rounded-r-md w-1/6 shadow-sm px-2 py-2 focus:outline-none"
        onClick={handleIncrement}
      >
        +
      </button>
    </div>
  );
};

export default NumberInput;
