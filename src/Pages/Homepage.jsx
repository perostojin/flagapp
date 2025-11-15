import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import Navbar from "../Components/Navbar/Navbar";
import SearchBar from "../Components/Searchbar/Searchbar";
import DropdownMenu from "../Components/Dropdown-menu/Dropdown-menu";
import CountryCard from "../Components/CountryCard/CountryCard";
import { Grid, Box, CircularProgress, Typography } from "@mui/material";
import { fetchAllCountries } from "../Utils/api";

function Homepage({ toggleTheme }) {
  const theme = useTheme();
  const darkMode = theme.palette.mode === "dark";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCountries = async () => {
      try {
        setLoading(true);
        const data = await fetchAllCountries();
        console.log("Countries from API:", data); // debug, kan tas bort sen
        setCountries(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching countries:", err);
        setError("Failed to fetch countries. Please try again later.");
        setLoading(false);
      }
    };

    getCountries();
  }, []);

  // Nu använder vi de mappade fälten: name, flag, population, region, capital
  const filteredCountries = [...countries]
    .sort((a, b) => a.name.localeCompare(b.name))
    .filter((country) => {
      const matchesSearch = country.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesRegion = selectedRegion
        ? country.region === selectedRegion
        : true;

      return matchesSearch && matchesRegion;
    });

  return (
    <Box
      sx={{
        backgroundColor: darkMode ? "#202c36" : "#f2f2f2",
        color: darkMode ? "#f2f2f2" : "#2b3844",
        minHeight: "100vh",
      }}
    >
      {/* Navbar */}
      <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />

      {/* Main Content */}
      <Box
        sx={{
          maxWidth: "1200px",
          margin: "2rem auto",
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "3rem",
        }}
      >
        {/* Filters Row */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: "1.5rem", sm: "0" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
          }}
        >
          {/* Search Bar */}
          <Box
            sx={{
              width: "100%",
              maxWidth: { xs: "100%", sm: "48%" },
            }}
          >
            <SearchBar
              darkMode={darkMode}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </Box>

          {/* Dropdown Menu */}
          <Box
            sx={{
              width: "100%",
              maxWidth: { xs: "100%", sm: "18.5%" },
              textAlign: "right",
            }}
          >
            <DropdownMenu
              darkMode={darkMode}
              selectedRegion={selectedRegion}
              setSelectedRegion={setSelectedRegion}
            />
          </Box>
        </Box>

        {/* Loading State */}
        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "200px",
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Typography
            sx={{
              color: darkMode ? "#f8d7da" : "#842029",
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            {error}
          </Typography>
        )}

        {/* Country Cards */}
        {!loading && !error && (
          <Grid
            container
            spacing={3}
            sx={{
              justifyContent: "center",
              padding: { xs: "1rem 0", sm: "0" },
            }}
          >
            {filteredCountries.map((country) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={country.name}
                sx={{ height: "auto" }}
              >
                <CountryCard
                  flag={country.flag}
                  name={country.name}
                  population={country.population}
                  region={country.region}
                  capital={country.capital || "N/A"}
                  darkMode={darkMode}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}

export default Homepage;
