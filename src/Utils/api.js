import axios from "axios";

const BASE_URL = "https://restcountries.com/v3.1";

// Mappa om ett land från v3.1 till ett enklare format som appen kan använda
const mapCountry = (c) => ({
  name: c.name?.common ?? "Unknown",
  flag: c.flags?.svg || c.flags?.png || "",
  population: c.population ?? 0,
  region: c.region ?? "",
  capital:
    Array.isArray(c.capital) && c.capital.length > 0 ? c.capital[0] : "N/A",

  // Extra fält till CountryPage:
  tld: Array.isArray(c.tld) ? c.tld : [],
  currencies: c.currencies || {},     // t.ex. { SEK: { name, symbol } }
  languages: c.languages || {},       // t.ex. { swe: "Swedish" }
  borders: c.borders || [],           // t.ex. ["NOR", "FIN"]
  cca3: c.cca3 || ""                  // landkod, används för border countries
});

/**
 * Hämtar alla länder.
 */
export const fetchAllCountries = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/all`, {
      params: {
        // här säger vi uttryckligen: ge oss ALLT vi behöver
        fields:
          "name,flags,population,region,capital,tld,currencies,languages,borders,cca3"
      }
    });

    return response.data.map(mapCountry);
  } catch (error) {
    console.error("Kunde inte hämta länder:", error);
    throw error;
  }
};

/**
 * Hämtar länder baserat på namn.
 */
export const fetchCountriesByName = async (name) => {
  try {
    const response = await axios.get(`${BASE_URL}/name/${name}`, {
      params: {
        fields:
          "name,flags,population,region,capital,tld,currencies,languages,borders,cca3"
      }
    });

    return response.data.map(mapCountry);
  } catch (error) {
    console.error(`Kunde inte hämta länder med namnet "${name}":`, error);
    throw error;
  }
};

/**
 * Hämtar länder baserat på region.
 */
export const fetchCountriesByRegion = async (region) => {
  try {
    const response = await axios.get(`${BASE_URL}/region/${region}`, {
      params: {
        fields:
          "name,flags,population,region,capital,tld,currencies,languages,borders,cca3"
      }
    });

    return response.data.map(mapCountry);
  } catch (error) {
    console.error(`Kunde inte hämta länder i regionen "${region}":`, error);
    throw error;
  }
};
