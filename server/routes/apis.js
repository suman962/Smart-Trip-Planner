const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");

const router = express.Router();

dotenv.config();
const API_KEY = process.env.GOOGLE_API_KEY;

router.get("/autocomplete", async (req, res) => {
  try {

    const response = await axios({
      method: 'POST',
      url: 'https://places.googleapis.com/v1/places:autocomplete',
      headers: {
        'X-Goog-Api-Key': API_KEY,
        'Content-Type': 'application/json'
      },
      data: {
        input: req.query.input,
        includeQueryPredictions: req.query.includeQueryPredictions === "true",
        includedPrimaryTypes: ["locality", "country", "administrative_area_level_1"],
        languageCode: "en"
      }
    });
    const suggestions = response.data.suggestions;
    if (!suggestions || suggestions.length === 0) {
      return res.json([]);
    }
    
    const places = suggestions.map(s => ({
      name:
        s.placePrediction.structuredFormat.mainText.text +
        (s.placePrediction.structuredFormat.secondaryText?.text
          ? ", " + s.placePrediction.structuredFormat.secondaryText.text
          : ""),
      placeId: s.placePrediction.placeId
    }));

    res.json(places);

  } catch (error) {
    console.error("Error in autocomplete route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
