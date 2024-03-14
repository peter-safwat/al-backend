const fs = require("fs");
const path = require("path");

const axios = require("axios");

const catchAsync = require("../utils/catchAsync");
const { leaguesData } = require("../utils/leaguesData");
const { serveDates } = require("../utils/APIConfig");
const { cupsData } = require("../utils/leaguesData");

const standingsOptions = {
  method: "GET",
  url: "https://api-football-v1.p.rapidapi.com/v3/standings",
  params: {
    season: serveDates(1).seasonYear,
    league: "",
  },
  headers: {
    "X-RapidAPI-Key": "92c814bc30msh07cc976712f6472p1b4e19jsnc7b06a3e742a",
    "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
  },
};

exports.getStandings = catchAsync(async (req, res, next) => {
  // get the specific file needed
  const pathFile = path.join(
    __dirname,
    "../",
    "APIdata",
    "Standings",
    req.query.type,
    `${req.query.id}.json`
  );

  const fileContent = fs.readFileSync(pathFile, "utf8");

  // Parse the JSON content
  const jsonData = JSON.parse(fileContent);
  res.status(200).json({
    status: "success",
    data: jsonData,
  });
});

exports.getFixturesAndResults = catchAsync(async (req, res, next) => {
  // get the specific file needed
  const pathFile = path.join(
    __dirname,
    "../",
    "APIdata",
    req.query.type,
    req.query.id,
    `${req.query.week}.json`
  );

  const fileContent = fs.readFileSync(pathFile, "utf8");

  // Parse the JSON content
  const jsonData = JSON.parse(fileContent);
  console.log(jsonData);
  res.status(200).json({
    status: "success",
    data: jsonData,
  });
});

const fetchStandingsDataByLeagueId = async (leagueId, type) => {
  standingsOptions.params.league = leagueId;
  try {
    // Update the league ID in the params
    const response = await axios.request(standingsOptions);
    // const data = response.data.response[0].league.standings[0];
    const data =
      type === "cup"
        ? response.data.response[0].league.standings
        : response.data.response[0].league.standings[0];

    const jsonData = JSON.stringify(data, null, 2); // The null and 2 parameters add indentation for better readability

    // Specify the file path
    const pathFile =
      type === "cup"
        ? `./APIdata/Standings/Cups/${leagueId}.json`
        : `./APIdata/Standings/Leagues/${leagueId}.json`;
    // Write the JSON string to the file
    fs.writeFileSync(pathFile, jsonData);
    console.log("Data has been written to the file.");
  } catch (error) {
    console.error(`Error fetching data for league ${leagueId}:`, error.message);
  }
};
const fetchfixuresAndResultDataByLeagueId = async (leagueId, type, order) => {
  try {
    // Update the the params object to the required week

    const fixturesAndResultsOptions = {
      method: "GET",
      url: "https://api-football-v1.p.rapidapi.com/v3/fixtures",
      params: {
        league: leagueId,
        season: serveDates(order).seasonYear,
        from:
          type === "fixures"
            ? serveDates(order).currDate
            : serveDates(order).formattedSevenDaysAgo,
        to:
          type === "fixures"
            ? serveDates(order).formattedSevenDaysLater
            : serveDates(order).currDate,
      },
      headers: {
        "X-RapidAPI-Key": "92c814bc30msh07cc976712f6472p1b4e19jsnc7b06a3e742a",
        "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
      },
    };
    const response = await axios.request(fixturesAndResultsOptions);
    const data = response.data.response;
    // const data = response;

    const jsonData = JSON.stringify(data, null, 2); // The null and 2 parameters add indentation for better readability

    // Specify the file path
    const pathFile =
      type === "fixures"
        ? `./APIdata/Fixtures/${leagueId}/${order}.json`
        : `./APIdata/Results/${leagueId}/${order}.json`;
    // Write the JSON string to the file
    fs.writeFileSync(pathFile, jsonData);
    console.log("Data has been written to the file.", type, order);
  } catch (error) {
    console.error(`Error fetching data for league ${leagueId}:`, error.message);
  }
};

exports.getStandingsScheduledData = async (req, res, next) => {
  try {
    // Fetch standings data for leagues
    await Promise.all(
      leaguesData.map(async (league) => {
        await fetchStandingsDataByLeagueId(league.id, "league");
      })
    );

    // // Fetch standings data for cups
    await Promise.all(
      cupsData.map(async (cup) => {
        await fetchStandingsDataByLeagueId(cup.id, "cup");
      })
    );
    console.log("All requests for standings completed successfully.");
  } catch (error) {
    console.error("Error in getScheduledData:", error.message);
  }
};

exports.getFixturesAndResultsForLeaguesScheduledData = async (
  req,
  res,
  next
) => {
  try {
    // // Fetch fixtures and result data for leagues
    await Promise.all(
      leaguesData.map(async (league) => {
        [1, 2, 3, 4, 5, 6, 7, 8].map(async (item) => {
          await fetchfixuresAndResultDataByLeagueId(league.id, "results", item);
        });
      })
    );
    await Promise.all(
      leaguesData.map(async (league) => {
        [1, 2, 3, 4, 5, 6, 7, 8].map(async (item) => {
          await fetchfixuresAndResultDataByLeagueId(league.id, "fixures", item);
        });
      })
    );

    console.log(
      "All requests fixtures&results for leagues completed successfully."
    );
  } catch (error) {
    console.error("Error in getScheduledData:", error.message);
  }
};

exports.getFixturesAndResultsForCupsScheduledData = async (req, res, next) => {
  try {
    // Fetch fixtures and result data for cups
    await Promise.all(
      cupsData.map(async (league) => {
        [1, 2, 3, 4, 5, 6, 7, 8].map(async (item) => {
          await fetchfixuresAndResultDataByLeagueId(league.id, "results", item);
        });
      })
    );

    await Promise.all(
      cupsData.map(async (league) => {
        [1, 2, 3, 4, 5, 6, 7, 8].map(async (item) => {
          await fetchfixuresAndResultDataByLeagueId(league.id, "fixures", item);
        });
      })
    );

    console.log(
      "All requests fixtures&results for cups completed successfully."
    );
  } catch (error) {
    console.error("Error in getScheduledData:", error.message);
  }
};
