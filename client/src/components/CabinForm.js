import React, { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCabinContext } from "../hooks/useCabinContext";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { useParams } from "react-router-dom";

export default function CabinForm({ edit }) {
  const navigate = useNavigate();
  const { setCabins, cabins } = useCabinContext();
  const [registered, setRegistered] = useState(true);
  const { user } = useAuthContext();
  const [newImage, setNewImage] = useState(null);
  const [cabinData, setCabinData] = useState({
    name: "",
    description: "",
    price: "",
    location: "",
    region: "",
    capacity: "",
    image: null,
  });

  const { id } = useParams();
  if (edit) {
    const cabinId = +id;
    const cabin = cabins.find((cabin) => cabin.id === cabinId);
    useEffect(() => {
      if (cabin && cabin.user_id === user.id) {
        setCabinData({
          name: cabin.name,
          description: cabin.description,
          price: cabin.price,
          location: cabin.location,
          region: cabin.region,
          capacity: cabin.capacity,
          image: cabin.image,
        });
      } else {
        navigate("/");
      }
    }, [cabin]);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "image") {
      setCabinData({
        ...cabinData,
        [name]: e.target.files[0],
      });
    } else {
      setCabinData({
        ...cabinData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !cabinData.name ||
      !cabinData.description ||
      !cabinData.price ||
      !cabinData.image
    ) {
      alert("Täytä kaikki kentät.");
      return;
    }

    const price = parseFloat(cabinData.price);
    if (isNaN(price) || price < 0 || price > 1000) {
      alert("Hinnan täytyy olla numero välillä 0-1000.");
      return;
    }

    const allowedExtensions = ["jpg", "jpeg", "png"];
    const extension = cabinData.image.name.split(".").pop().toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      alert("Kuvan täytyy olla muodossa jpg, jpeg, or png.");
      return;
    }

    const formData = new FormData();
    formData.append("user_id", Number(user.id));
    formData.append("name", cabinData.name);
    formData.append("description", cabinData.description);
    formData.append("price", price);
    formData.append("location", cabinData.location);
    formData.append("region", cabinData.region);
    formData.append("capacity", cabinData.capacity);
    formData.append("image", cabinData.image);

    try {
      axios
        .post("http://localhost:8800/api/cabins", formData)
        .then((response) => {
          setCabins((prevCabins) => [...prevCabins, response.data]);
          navigate("/");
        });
    } catch (error) {
      console.error("Error while making the POST request:", error);
      alert(
        "An error occurred while submitting the cabin. Please try again later."
      );
    }
  };

  const handleSubmit2 = async (e) => {
    e.preventDefault();
    const cabinId = +id;
    if (
      !cabinData.name ||
      !cabinData.description ||
      !cabinData.price ||
      !cabinData.location ||
      !cabinData.region ||
      !cabinData.capacity
    ) {
      alert("Täytä kaikki kentät.");
      return;
    }

    const price = parseFloat(cabinData.price);
    if (isNaN(price) || price < 0 || price > 1000) {
      alert("Hinnan täytyy olla numero välillä 0-1000.");
      return;
    }

    const formData = new FormData();
    formData.append("user_id", Number(user.id));
    formData.append("name", cabinData.name);
    formData.append("description", cabinData.description);
    formData.append("price", price);
    formData.append("location", cabinData.location);
    formData.append("region", cabinData.region);
    formData.append("capacity", cabinData.capacity);

    if (newImage) {
      const newImageBlob = await fetch(newImage).then((response) =>
        response.blob()
      );
      formData.append("image", newImageBlob, "newImage.jpg");
    } else {
      formData.append("image", cabinData.image);
    }

    try {
      const response = await axios.put(
        `http://localhost:8800/api/cabins/${cabinId}`,
        formData
      );
      const updatedCabins = cabins.map((cabin) => {
        if (cabin.id === cabinId) {
          return response.data;
        }
        return cabin;
      });
      setCabins(updatedCabins);
      alert("Mökki päivitetty onnistuneesti.");
      navigate("/");
    } catch (error) {
      console.error("Error while making the PUT request:", error);
      alert(
        "An error occurred while updating the cabin. Please try again later."
      );
    }
  };
  if (!user) {
    return (
      <div className="bg-white w-2/3 mx-auto rounded-lg my-6 p-6 shadow-lg text-center">
        <p className="text-2xl">
          Sinun täytyy kirjautua sisään lisätäksesi mökkejä.
        </p>
        {registered ? (
          <LoginForm setRegistered={setRegistered} />
        ) : (
          <RegisterForm setRegistered={setRegistered} />
        )}
      </div>
    );
  }
  const uploadImage = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    try {
      const response = await fetch("http://localhost:8800/api/cabins/image", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Image uploaded successfully:", result.imageUrl);
        setNewImage(result.imageUrl);
      } else {
        console.error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  return (
    <div className="mx-auto w-2/3 bg-white text-center my-6 p-6 rounded-lg">
      <form
        className="w-1/2 mx-auto"
        onSubmit={edit ? handleSubmit2 : handleSubmit}
        encType="multipart/form-data"
      >
        <div className="mb-6">
          <label
            htmlFor="name"
            className="text-regentGray font-bold inline-block pb-2"
          >
            Mökin nimi:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={cabinData.name}
            onChange={handleChange}
            className="border border-tiara rounded-md w-full shadow-sm px-5 py-2"
            placeholder="Mökin nimi"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="description"
            className="text-regentGray font-bold inline-block pb-2"
          >
            Kuvaus:
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={cabinData.description}
            onChange={handleChange}
            className="border border-tiara rounded-md w-full shadow-sm px-5 py-2"
            placeholder="Mökin kuvaus"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="price"
            className="text-regentGray font-bold inline-block pb-2"
          >
            Hinta (vrk/€):
          </label>
          <input
            type="text"
            id="price"
            name="price"
            value={cabinData.price}
            onChange={handleChange}
            className="border border-tiara rounded-md w-full shadow-sm px-5 py-2"
            placeholder="Mökin hinta numerona (vrk/€) (esim. 100)"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="location"
            className="text-regentGray font-bold inline-block pb-2"
          >
            Kaupunki
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={cabinData.location}
            onChange={handleChange}
            className="border border-tiara rounded-md w-full shadow-sm px-5 py-2"
            placeholder="Kaupunki (esim. Helsinki)"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="region"
            className="text-regentGray font-bold inline-block pb-2"
          >
            Maakunta
          </label>
          <input
            type="text"
            id="region"
            name="region"
            value={cabinData.region}
            onChange={handleChange}
            className="border border-tiara rounded-md w-full shadow-sm px-5 py-2"
            placeholder="Maakunta (esim. Uusimaa)"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="capacity"
            className="text-regentGray font-bold inline-block pb-2"
          >
            Henkilömäärä
          </label>
          <input
            type="number"
            id="capacity"
            name="capacity"
            value={cabinData.capacity}
            onChange={handleChange}
            className="border border-tiara rounded-md w-full shadow-sm px-5 py-2"
            placeholder="Henkilömäärä (esim. 4)"
            required
            min={1}
            max={99}
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="image"
            className="text-regentGray font-bold inline-block pb-2"
          >
            Kuva (jpg, jpeg, png):
          </label>
          {edit ? (
            <>
              {cabinData.image && !newImage && (
                <>
                  <img
                    src={`http://localhost:8800/uploads/${cabinData.image}`}
                    alt="cabin"
                    className="w-1/2 mx-auto"
                  />
                  <p> Valitse uusi kuva, jos haluat vaihtaa kuvan.</p>
                </>
              )}

              {newImage && (
                <img src={newImage} alt="cabin" className="w-1/2 mx-auto" />
              )}

              <input
                type="file"
                id="image"
                name="image"
                accept=".jpg, .jpeg, .png"
                onChange={uploadImage}
                className="border border-tiara rounded-md w-full shadow-sm px-5 py-2"
              />
            </>
          ) : (
            <input
              type="file"
              id="image"
              name="image"
              accept=".jpg, .jpeg, .png"
              onChange={handleChange}
              className="border border-tiara rounded-md w-full shadow-sm px-5 py-2"
            />
          )}
        </div>
        <button
          type="submit"
          className="text-white bg-blueZodiac border-2 p-4 rounded-lg hover:bg-blueFountain hover:text-white transition duration-300 ease-in-out"
        >
          Lisää mökki
        </button>
      </form>
    </div>
  );
}
