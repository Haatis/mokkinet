import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { CabinProvider } from "./hooks/useCabinContext";
import { ReviewProvider } from "./hooks/useReviewContext";
import { AuthProvider } from "./hooks/useAuthContext";
import { FavoritesProvider } from "./hooks/useFavoritesContext";
import { ReservationProvider } from "./hooks/useReservationContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ReservationProvider>
        <FavoritesProvider>
          <CabinProvider>
            <ReviewProvider>
              <App />
            </ReviewProvider>
          </CabinProvider>
        </FavoritesProvider>
      </ReservationProvider>
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

