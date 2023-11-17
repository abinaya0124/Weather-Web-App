import React, { useEffect, useState } from "react";
import APIKey from "./APIKey";
const ApiKey = APIKey();
import { MdOutlineShareLocation } from "react-icons/md";
import { IoSearchOutline } from "react-icons/io5";
import axios from "axios";

const WeatherDetails = () => {
  const [name, setName] = useState("");

  const convertToDMS = (degrees) => {
    const deg = Math.floor(degrees);
    const minFloat = (degrees - deg) * 60;
    const min = Math.floor(minFloat);
    const sec = Math.round((minFloat - min) * 60);

    return `${deg}°${min}'${sec}°N`;
  };

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

  const convertUnixTimestampToTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const options = { hour: "numeric", minute: "numeric", hour12: true };
    return date.toLocaleTimeString("en-US", options);
  };

  const celsiusToFahrenheit = (celsius) => {
    return (celsius * 9) / 5 + 32;
  };

  const formatTemperature = (celsius) => {
    const fahrenheit = celsiusToFahrenheit(celsius);
    return `${celsius}°C / ${fahrenheit.toFixed(1)}°F`;
  };

  const createWeatherCard = (item) => {
    return `<div className="weatherCards">
    <h5 className="dates">${item.dt_txt.split(" ")[0]}</h5>
    <div className="card">
      <div className="heading">
         <img src="https://openweathermap.org/img/wn/${
           item.weather[0].icon
         }@2x.png"/> 
        <h5>${item.weather[0].main}</h5>
      </div>
      <li className="weather_details">
      <h6>${formatTemperature(item.main.temp_max)}</h6>
      <h6>${formatTemperature(item.main.temp_min)}</h6>
      <h6>${item.main.humidity}%</h6>
      <h6>${item.sys.sunrise} </h6>
      <h6>${item.sys.sunset}</h6>
    </li>
    </div>
  </div>
    
   `;
  };

  const days = async (name, lat, lon) => {
    const days_url = `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&appid=${ApiKey}`;

    // console.log("Day Url", days_url);
    try {
      const res = await axios.get(days_url);
      // console.log(res.data);
      const forecastDays = [];

      const fiveDaysReport = res.data.list.filter((item) => {
        const forecastDate = new Date(item.dt_txt).getDate();
        if (!forecastDays.includes(forecastDate)) {
          return forecastDays.push(forecastDate);
        }
      });

      document.querySelector(".weatherCards").innerHTML = "";
      console.log(fiveDaysReport);
      // console.log(forecastDays);

      fiveDaysReport.forEach((item) => {
        document
          .querySelector(".weatherCards")
          .insertAdjacentHTML("beforeend", createWeatherCard(item));
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = async () => {
    if (name !== "") {
      //   if (!data.length) {
      //     alert("Not a valid input is given");
      //   }
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${ApiKey}&&units=metric`;
      try {
        const res = await axios.get(url);
        setData({
          ...data,
          lat: res.data.coord.lat,
          lon: res.data.coord.lon,
          day: res.data.dt_txt,
          weather: res.data.weather[0].main,
          high_tem: res.data.main.temp_max,
          low_tem: res.data.main.temp_min,
          hum: res.data.main.humidity,
          sunrise: convertUnixTimestampToTime(res.data.sys.sunrise),
          sunset: convertUnixTimestampToTime(res.data.sys.sunset),
        });
        console.log(res.data);
        // days(res.data.name, res.data.lat, res.data.lon);
        const { name, lat, lon } = data;
        days(name, lat, lon);
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="weatherDetails">
      <div className="whole__container1">
        <div className="input_box">
          <h3>
            <MdOutlineShareLocation />
            {name}
          </h3>
          <small>
            {convertToDMS(data.lat)} & {convertToDMS(data.lon)}
          </small>
        </div>
        <div className="search_city">
          <input
            type="text"
            placeholder="Search Your City Here..."
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={handleClick}>
            <IoSearchOutline className="search_icon" />
          </button>
        </div>
      </div>

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
  );
};

export default WeatherDetails;
