export const decideWeather = (weather) => weather.precipitationProbability >= 60 ? "bring umbrella" : "leave umbrella";

export const fetchWeatherDecision = async ({ baseUrl, city, date }) => {
  const response = await fetch(`${baseUrl}/weather?city=${encodeURIComponent(city)}&date=${encodeURIComponent(date)}`);
  if (!response.ok) throw new Error(`Weather request failed with ${response.status}`);
  const weather = await response.json();
  return { weather, decision: decideWeather(weather) };
};
