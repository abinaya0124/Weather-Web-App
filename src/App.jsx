import React from "react";
import Calender from "./Components/Calender";
import "./App.scss";
import { MdOutlineRefresh, MdOutlineShareLocation } from "react-icons/md";
import weather99 from "./Images/weather99.png";
import WeatherDetails from "./Components/WeatherDetails";

const App = () => {
  return (
    <div className="weather_99">
      <div className="top_bar">
        <div className="left_logo">
          <img src={weather99} />
          <h3>Weather 99</h3>
        </div>
        <div className="refresh">
          <MdOutlineRefresh className="refresh_icon" />
          <button onClick={() => window.location.reload()}>Refresh</button>
        </div>
      </div>
      <div className="calender_cards">
        <Calender />
        <WeatherDetails />
      </div>
    </div>
  );
};

export default App;
