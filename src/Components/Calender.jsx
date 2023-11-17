import React from "react";
import "../Styling/Calender.scss";

const Calender = () => {
  return (
    <div className="calender_sidebox">
      <p>Select Date:</p>
      <input type="date" className="calender" />
      <div className="side_details">
        <h6>High Temperature</h6>
        <h6>Low Temperature</h6>
        <h6>Humidity</h6>
        <h6>Sunrise Time</h6>
        <h6>Sunset Time</h6>
      </div>
    </div>
  );
};

export default Calender;
