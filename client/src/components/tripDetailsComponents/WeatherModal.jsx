import { useEffect } from "react";
import "./WeatherModal.css";

function WeatherModal({ weatherData, onClose }) {
  useEffect(() => {
    console.log(weatherData);
  }, []);
  // return (
  //   <div className="weather-modal-overlay">
  //     <div className="weather-modal">
  //       <div className="weather-modal-header">
  //         <h2>Weather Forecast</h2>
  //         <button onClick={onClose}>Close</button>
  //       </div>
  //       <div className="weather-modal-body">
  //         {Object.keys(weatherData).length > 0 && (
  //           <div>
  //             {Object.entries(weatherData).map(([city, data]) => (
  //               <div key={city}>
  //                 <h3>{city}</h3>
  //                 {data.map((day) => (
  //                   <div key={day.dt} className="weather-day">
  //                     <p>
  //                       Date: {new Date(day.dt * 1000).toLocaleDateString()}
  //                     </p>
  //                     <img
  //                       src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
  //                       alt={day.weather[0].description}
  //                     />
  //                     <p>
  //                       Temperature: {day.temp.min}°C / {day.temp.max}°C
  //                     </p>
  //                     <p>Condition: {day.weather[0].description}</p>
  //                     {/* Add more weather details as needed */}
  //                   </div>
  //                 ))}
  //               </div>
  //             ))}
  //           </div>
  //         )}
  //       </div>
  //     </div>
  //   </div>
  // );
}

export default WeatherModal;
