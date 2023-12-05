import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styling/WeatherDetails.scss";
import { MdOutlineShareLocation } from "react-icons/md";
import { IoSearchOutline } from "react-icons/io5";
import APIKey from "./APIKey";
const ApiKey = APIKey();

const App = () => {
  const [data, setData] = useState({
    lat: "",
    lon: "",
    day: "",
    weather: "",
    high_tem: "",
    low_tem: "",
    hum: "",
    sunrise: "",
    sunset: "",
  });

  const [inputValue, setInputValue] = useState("");

  const convertToDMS = (degrees) => {
    const deg = Math.floor(degrees);
    const minFloat = (degrees - deg) * 60;
    const min = Math.floor(minFloat);
    const sec = Math.round((minFloat - min) * 60);

    return `${deg}°${min}'${sec}°N`;
  };

  const convertUnixTimestampToTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const options = { hour: "numeric", minute: "numeric", hour12: true };
    return date.toLocaleTimeString("en-US", options);
  };

  const convertTemperature = (kelvin) => {
    const celsius = kelvin - 273.15;
    const fahrenheit = (kelvin - 273.15) * (9 / 5) + 32;

    return {
      celsius: celsius.toFixed(2),
      fahrenheit: fahrenheit.toFixed(2),
    };
  };

  const formatTemperature = (kelvin) => {
    const { celsius, fahrenheit } = convertTemperature(kelvin);
    return `${celsius}°C / ${fahrenheit}°F`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputValue !== "") {
      try {
        const res1 = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=${ApiKey}&&units=metric`
        );
        setData((data) => ({
          ...data,
          lat: res1.data.coord.lat,
          lon: res1.data.coord.lon,
          sunrise: res1.data.sys.sunrise,
          sunset: res1.data.sys.sunset,
        }));

        const { lat, lon } = res1.data.coord;

        const { sunrise, sunset } = res1.data.sys;

        days(lat, lon, sunrise, sunset);
        console.log(res1.data.coord.lat);
        console.log(res1.data.coord.lon);

        console.log(res1.data.sys.sunrise);
        console.log(res1.data.sys.sunset);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const days = async (lat, lon, sunrise, sunset) => {
    try {
      const res2 = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${ApiKey}`
      );

      console.log(res2.data);
      console.log(sunrise);
      console.log(lat);
      const forecastList = [];

      const fiveDaysReport = res2.data.list.filter((item) => {
        const forecastDate = new Date(item.dt_txt).getDate();
        if (!forecastList.includes(forecastDate)) {
          return forecastList.push(forecastDate);
        }
      });
      document.querySelector(".weatherCards").innerHTML = "";
      console.log(fiveDaysReport);

      fiveDaysReport.forEach((item) => {
        document.querySelector(".weatherCards").insertAdjacentHTML(
          "beforeend",
          `<div  class="weatherCards">
            <div>
              <div>
                <h3 class="time__date">${item.dt_txt.split(" ")[0]}</h3>
              </div>
              <div class="card">
                <div class="heading"> 
                  <img src="https://openweathermap.org/img/wn/${
                    item.weather[0].icon
                  }@2x.png"/> 
                  <h5>${item.weather[0].main}</h5>
                </div>
                <li class="weather_details">
                  <h6>${formatTemperature(item.main.temp_max)}</h6>
                  <h6>${formatTemperature(item.main.temp_min)}</h6>
                  <h6>${item.main.humidity}%</h6>
                  <h6>${convertUnixTimestampToTime(sunrise)} </h6>
                  <h6>${convertUnixTimestampToTime(sunset)}</h6>
                </li>
              </div>
            </div>
        </div>
         `
        );
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <div className="weatherDetails">
        <div className="whole__container1">
          <div className="input_box">
            <h3>
              <MdOutlineShareLocation />
              {inputValue}
            </h3>
            <small>
              {convertToDMS(data.lat)} & {convertToDMS(data.lon)}
            </small>
          </div>
          <div className="search_city">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={inputValue}
                placeholder="Search Your City Here..."
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button>
                <IoSearchOutline className="search_icon" />
              </button>
            </form>
          </div>
        </div>
        <div className="border_bottom"></div>

        <div className="calender_weatherCards">
          <div className="calender_sidebox">
            <p>Select Date:</p>
            <div className="calender_container">
              <input type="date" className="calender" />
            </div>
            <div className="side_details">
              <h6>High Temperature</h6>
              <h6>Low Temperature</h6>
              <h6>Humidity</h6>
              <h6>Sunrise Time</h6>
              <h6>Sunset Time</h6>
            </div>
          </div>

          <div className="total_weather_cards">
            <div className="weatherCards">
              <h5 className="dates">{data.day}</h5>
              <div className="card">
                <div className="heading">
                  <img />
                  <h5>{data.weather}</h5>
                </div>
                <li className="weather_details">
                  <h6>{formatTemperature(data.high_tem)}</h6>
                  <h6>{formatTemperature(data.low_tem)}</h6>
                  <h6>{data.hum}%</h6>
                  <h6>{data.sunrise} </h6>
                  <h6>{data.sunset}</h6>
                </li>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
