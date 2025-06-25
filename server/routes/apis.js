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

router.get("/place", async (req, res) => {
  try {
    if (!req.query.id) {
      return res.status(400).json({ error: "id query parameter is required"
      });
    }
    const response = await axios({
      method: 'GET',
      url: `https://places.googleapis.com/v1/places/${req.query.id}`,
      headers: {
        'X-Goog-Api-Key': API_KEY,
        'Content-Type': 'application/json',
        'X-Goog-FieldMask': '*',
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching place details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/placephoto", async (req, res) => {
  try {
    if (!req.query.photo) {
      return res.status(400).json({ error: "photo query parameter is required"
      });
    }
    const response = await axios({
      method: 'GET',
      url: `https://places.googleapis.com/v1/${req.query.photo}/media`,
      headers: {
        'X-Goog-Api-Key': API_KEY,
        'Content-Type': 'application/json',
      },
      params: {
        maxHeightPx: 1000,
        key: API_KEY
      },
      responseType: 'arraybuffer'
    });

    res.set('Content-Type', response.headers['content-type']);
    res.send(Buffer.from(response.data));

  } catch (error) {
    console.error("Error fetching place photo:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
