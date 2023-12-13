import NavBar from "./components/NavBar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/HomePage";
import About from "./pages/AboutPage";
import Cabin from "./pages/CabinPage";
import Footer from "./components/Footer";
import AddCabin from "./pages/AddCabinPage";
import Login from "./pages/LoginPage";
import Favorites from "./pages/FavoritesPage";
import Reservations from "./pages/ReservationsPage";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import CabinList from "./pages/CabinListPage";
import Locations from "./pages/LocationsPage";
import UserCabinListPage from "./pages/UserCabinListPage";
import EditCabinPage from "./pages/EditCabinPage";

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
}

function App() {
  return (
    <div>
      <BrowserRouter>
        <NavBar />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/cabin/:id" element={<Cabin />} />
          <Route path="/addcabin" element={<AddCabin />} />
          <Route path="/editcabin/:id" element={<EditCabinPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/cabins" element={<CabinList />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/userCabins" element={<UserCabinListPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;

