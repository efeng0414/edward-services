const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();

const { geocode, placesAutoComplete } = require("./routes")

app.get('/geocode', geocode);
app.get('/places-autocomplete', placesAutoComplete);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});