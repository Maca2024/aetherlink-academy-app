export type WeatherInput = { city: string; date: string };

export const weatherUrl = (baseUrl: string, input: WeatherInput) => `${baseUrl}/weather?city=${encodeURIComponent(input.city)}&date=${encodeURIComponent(input.date)}`;
