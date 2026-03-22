const API_KEY = "a64457e8a5a45a3e0ac3316d737c58ad";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const resultDiv = document.getElementById("weatherResult");
  const forecastDiv = document.getElementById("forecast");
  const errorP = document.getElementById("error");

  if (!city) return;

  // Hide previous results
  resultDiv.classList.add("hidden");
  forecastDiv.innerHTML = "";
  errorP.classList.add("hidden");

  try {
    // Current weather
    const res = await fetch(
      `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=imperial`
    );
    if (!res.ok) throw new Error("City not found");
    const data = await res.json();

    resultDiv.innerHTML = `
      <h2>${data.name}, ${data.sys.country}</h2>
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" />
      <div class="temp">${Math.round(data.main.temp)}°F</div>
      <div class="desc">${data.weather[0].description}</div>
      <div class="details">
        <div>Humidity<br/><strong>${data.main.humidity}%</strong></div>
        <div>Wind<br/><strong>${Math.round(data.wind.speed)} mph</strong></div>
        <div>Feels Like<br/><strong>${Math.round(data.main.feels_like)}°F</strong></div>
      </div>
    `;
    resultDiv.classList.remove("hidden");

    // 5-day forecast
    const forecastRes = await fetch(
      `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=imperial`
    );
    const forecastData = await forecastRes.json();

    // Get one reading per day (every 8th item = 24hrs apart)
    const dailyForecasts = forecastData.list.filter((_, i) => i % 8 === 0).slice(0, 5);

    forecastDiv.innerHTML = dailyForecasts.map(day => {
      const date = new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "short" });
      return `
        <div class="forecast-card">
          <div>${date}</div>
          <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" />
          <div class="f-temp">${Math.round(day.main.temp)}°F</div>
          <div>${day.weather[0].main}</div>
        </div>
      `;
    }).join("");

  } catch (err) {
    errorP.classList.remove("hidden");
  }
}

document.getElementById("cityInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") getWeather();
});