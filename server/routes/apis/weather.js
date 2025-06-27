const express = require("express");
const axios = require("axios");
const askAI = require("../../ai");

const router = express.Router();

router.post("/weatherhistory", async (req, res) => {
  try {
    const { latitude, longitude, start_date, end_date } = req.body;

    if (!latitude || !longitude || !start_date || !end_date) {
      return res.status(400).json({ error: "Missing required parameters: latitude, longitude, start_date, end_date" });
    }
    const params = {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      start_date: start_date,
      end_date: end_date,
      daily: "temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_hours,daylight_duration,weather_code",
      monthly: "temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_hours,daylight_duration,weather_code",
      format: "json"
    };

    const response = await axios({
      method: "get",
      url: "https://archive-api.open-meteo.com/v1/archive",
      params: params,
      timeout: 10000 
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching weather history:", error.message);
    res.status(500).json({ error: "Weather service temporarily unavailable" });
  }
});

router.post("/weatherforecast", async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Missing required parameters: latitude, longitude" });
    }

    const params = {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      daily: "temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_hours,daylight_duration,weather_code",
      format: "json",
      forecast_days: 14
    };

    const response = await axios({
      method: "get",
      url: "https://api.open-meteo.com/v1/forecast",
      params: params,
      timeout: 10000
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching forecast:", error.message);
    res.status(500).json({ error: "Weather service temporarily unavailable" });
  }
});

router.post("/weatherbesttime", async (req, res) => {
  try {
    const { forecast, history } = req.body;
    let { toFind } = req.body;
    if (!forecast || !history || !toFind)
      return res.status(400).json({ error: "Missing forecast, history, or toFind" });

    toFind = parseInt(toFind);

    var time;
    switch (toFind) {
      case 7:
        time = "day";
      case 30:
        time = "week";
      case 90:
        time = "bi-week";
      case 365:
        time = "month";
    }

    const question = `Forecast: ${JSON.stringify(forecast)}
    History: ${JSON.stringify(history)}

    Forecast is upto 14 days and history is upto 5 years of data given.
    what is the best time to visit?
    Remember to take every condition. like first find optimal temperature, then find optimal weather code, then find optimal precipitation, then find optimal daylight duration.
    and then combine all these to find the best time to visit.
    And at last, try to think comparing human visit and comfort level.
    Say me the answer in upcoming ${time} format within ${toFind} days based on the forecast and history data.
    if forecast is not available upto that say, then use history data and analyze it.
    if upcoming time is day, then say me day to visit in upcoming ${toFind} days like example. next Monday.
    if upcoming time is week, then say me week to visit in upcoming ${toFind} days like example. next to next week or after 3 weeks.
    if upcoming time is bi-week, then say me bi-week to visit in upcoming ${toFind} days like example. same as week, but for 2 weeks.
    if upcoming time is month, then say me month to visit in upcoming ${toFind} days like example. next month or any month over all year which is best.
    Don't Say anything else, just give me the answer in a single word or a phrase for a ${time}.
    `;

    const aiResponse = await askAI(question);
    res.json(aiResponse.replace('.', ''));
  } catch (err) {
    console.error("weatherbesttime error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;
