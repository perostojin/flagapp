import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Grid } from "@mui/material";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../Components/Navbar/Navbar";
import ArrowLeft from "../assets/arrow-left.svg";
import ArrowLeftDark from "../assets/arrow-left-dark.svg";
import { useTheme } from "@mui/material/styles";
import Flag from "../Components/Flag/Flag";
import axios from "axios";

const CountryPage = ({ toggleTheme }) => {
  const { countryName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const darkMode = theme.palette.mode === "dark";

  const [country, setCountry] = useState(null);
  const [borderCountries, setBorderCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        setLoading(true);

        // Hämta landet baserat på namnet i URL:en
        const res = await axios.get(
          `https://restcountries.com/v3.1/name/${countryName}`,
          {
            params: {
              fullText: true,
              fields:
                "name,flags,population,region,capital,tld,currencies,languages,borders,cca3",
            },
          }
        );

        const c = res.data[0];
        setCountry(c);

        // Hämta grannländer (om det finns några)
        if (c.borders && c.borders.length > 0) {
          const bordersRes = await axios.get(
            "https://restcountries.com/v3.1/alpha",
            {
              params: {
                codes: c.borders.join(","),
                fields: "name,cca3",
              },
            }
          );
          setBorderCountries(bordersRes.data);
        } else {
          setBorderCountries([]);
        }

        setError(false);
      } catch (err) {
        console.error("Error fetching country data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCountryData();
  }, [countryName]);

  if (error) {
    return (
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h5">Country not found.</Typography>
      </Box>
    );
  }

  if (loading || !country) {
    return (
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h5">Loading...</Typography>
      </Box>
    );
  }

  const showHomeButton = location.state?.fromBorderCountry || false;

  // Formatera currencies och languages utifrån v3.1-strukturen
  const currencyText =
    Object.values(country.currencies || {})
      .map((c) => (c.symbol ? `${c.name} (${c.symbol})` : c.name))
      .join(", ") || "N/A";

  const languageText =
    Object.values(country.languages || {}).join(", ") || "N/A";

  const tldText =
    country.tld && country.tld.length ? country.tld.join(", ") : "N/A";

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        minHeight: "100vh",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      {/* Navbar */}
      <Navbar toggleTheme={toggleTheme} />

      {/* Main Content */}
      <Box
        sx={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "1rem",
          marginTop: { xs: "0rem", sm: "9rem" },
        }}
      >
        {/* Navigation Buttons */}
        <Box sx={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
          <Button
            onClick={() => navigate(-1)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              backgroundColor: "transparent",
              color: theme.palette.text.primary,
              fontSize: "1rem",
              fontWeight: 600,
              textTransform: "none",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              boxShadow: "none",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: darkMode
                  ? "0 4px 10px rgba(0, 0, 0, 0.8)"
                  : "0 4px 10px rgba(0, 0, 0, 0.3)",
              },
            }}
          >
            <img
              src={darkMode ? ArrowLeft : ArrowLeftDark}
              alt="Back"
              style={{ width: "20px", height: "20px" }}
            />
            Back
          </Button>

          {showHomeButton && (
            <Button
              onClick={() => navigate("/")}
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "transparent",
                color: theme.palette.text.primary,
                fontSize: "1rem",
                fontWeight: 600,
                textTransform: "none",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                boxShadow: "none",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: darkMode
                    ? "0 4px 10px rgba(0, 0, 0, 0.8)"
                    : "0 4px 10px rgba(0, 0, 0, 0.3)",
                },
              }}
            >
              Home
            </Button>
          )}
        </Box>

        {/* Country Details */}
        <Grid container spacing={4} sx={{ alignItems: "flex-start" }}>
          {/* Flag */}
          <Grid item xs={12} md={5}>
            <Flag
              src={country.flags?.svg || country.flags?.png}
              alt={`Flag of ${country.name?.common}`}
              variant="countryPage"
            />
          </Grid>

          {/* Information */}
          <Grid item xs={12} md={7}>
            <Typography variant="h4" sx={{ marginBottom: "1rem" }}>
              {country.name?.common}
            </Typography>

            <Grid container spacing={2}>
              {/* Left Column */}
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Population:</strong>{" "}
                  {country.population.toLocaleString()}
                </Typography>
                <Typography variant="body1">
                  <strong>Region:</strong> {country.region}
                </Typography>
                <Typography variant="body1">
                  <strong>Capital:</strong>{" "}
                  {country.capital?.join(", ") || "N/A"}
                </Typography>
              </Grid>

              {/* Right Column */}
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Top Level Domain:</strong> {tldText}
                </Typography>
                <Typography variant="body1">
                  <strong>Currencies:</strong> {currencyText}
                </Typography>
                <Typography variant="body1">
                  <strong>Languages:</strong> {languageText}
                </Typography>
              </Grid>
            </Grid>

            {/* Border Countries */}
            <Box sx={{ marginTop: "2rem" }}>
              <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
                <strong>Border Countries:</strong>
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {borderCountries.length > 0
                  ? borderCountries.map((borderCountry) => (
                      <Button
                        key={borderCountry.cca3}
                        onClick={() =>
                          navigate(`/country/${borderCountry.name.common}`, {
                            state: { fromBorderCountry: true },
                          })
                        }
                        sx={{
                          backgroundColor: "transparent",
                          color: theme.palette.text.primary,
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          padding: "0.5rem 1rem",
                          borderRadius: "8px",
                          boxShadow: "none",
                          textTransform: "none",
                          border: `1px solid ${
                            darkMode ? "rgba(255,255,255,0.2)" : "#ccc"
                          }`,
                          "&:hover": {
                            transform: "scale(1.05)",
                            boxShadow: darkMode
                              ? "0 4px 10px rgba(0, 0, 0, 0.8)"
                              : "0 4px 10px rgba(0, 0, 0, 0.3)",
                          },
                        }}
                      >
                        {borderCountry.name.common}
                      </Button>
                    ))
                  : "None"}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default CountryPage;
