import axios from "axios";

const URL = "https://api.weatherapi.com/v1/current.json";
const API_KEY = "42032ea81fa140ef88b113752251801";

export const fetchWeather = async (cityName) => {
  const { data } = await axios.get(URL, {
    params: {
      q: cityName,
      key: API_KEY,
    },
  });  
  return data;
};
