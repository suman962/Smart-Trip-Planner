const express = require("express");
const axios = require("axios");
const router = express.Router()

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
      daily: "temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_hours,daylight_duration",
      monthly: "temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_hours,daylight_duration",
      format: "json"
    };

    const response = await axios(
      {
        method: "get",
        url: "https://archive-api.open-meteo.com/v1/archive",
        params: params
      }
    )
    console.log("Weather history response:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching weather history:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
