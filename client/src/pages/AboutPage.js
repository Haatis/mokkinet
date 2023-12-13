import React from "react";

export default function About() {
  return (
    <div className="flex flex-col items-center  min-h-screen bg-tiara mt-16">
      <div className="bg-white w-2/3 mx-auto rounded-lg my-6 p-6 shadow-lg">
        <p className="text-2xl font-bold text-center mb-4">Tietoa </p>
        <p className="text-lg text-center mb-4">
          Tämä sivusto on vapaa-ajalla toteutettu projekti, joka käyttää Reactia
          frontendissä ja Node.js:ssä Expressiä backendissä. Tietokantana on
          MySQL.
        </p>
        <p className="text-lg text-center mb-4">
          Työstin sivustoa työharjoitteluni ohella, joten aikaa sivuston
          tekemiseen ei ollut paljoa. Projektista kuitenkin tuli paljon suurempi
          kuin aluksi olin ajatellut. Ominaisuuksia sovelluksesta löytyy
          kattavasti, mutta sivuston ulkoasu/responsiivisuus on jäänyt vähän
          vähemmälle. Bugejakin voi sovelluksesta löytyä.
        </p>
        <p className="text-2xl font-bold text-center mb-4">Ominaisuudet </p>
        <p className="text-lg text-center mb-4">
          Sovelluksen ominaisuuksiin kuuluu muun muassa käyttäjien
          rekisteröityminen, sisäänkirjautuminen, mökkien lisääminen,
          varaaminen, muokkaaminen, poistaminen, suosikiksi lisääminen,
          arvostelun lisääminen, arvostelun poisto sekä mökkien suodatus.
        </p>
      </div>
    </div>
  );
}
