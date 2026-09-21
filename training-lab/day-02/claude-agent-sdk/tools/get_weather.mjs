export const weatherUrl = (baseUrl, { city, date }) => `${baseUrl}/weather?city=${encodeURIComponent(city)}&date=${encodeURIComponent(date)}`;
