const axios = require("axios");

const catchAsync = require("../utils/catchAsync");

exports.getLeagueStandings = catchAsync(async (req, res, next) => {
  const options = {
    method: "GET",
    url: "https://api-football-beta.p.rapidapi.com/standings",
    params: {
      season: "2023",
      league: req.query.leagueId,
    },
    headers: {
      "X-RapidAPI-Key": "ce9352625bmsh696018192ac810ap154737jsn455dc1574f86",
      "X-RapidAPI-Host": "api-football-beta.p.rapidapi.com",
    },
  };
  const response = await axios.request(options);
  res.status(200).json({
    status: "success",
    data: response.data,
  });
});

exports.getLeagueFixtures = catchAsync(async (req, res, next) => {
  const now = new Date();
  const localDate = now.toISOString().split("T")[0];
  const futureDate = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
  const futureLocalDate = futureDate.toISOString().split("T")[0];
  const season =
    now.getMonth() > 5 ? now.getUTCFullYear() : now.getUTCFullYear() - 1;

  const options = {
    method: "GET",
    url: "https://api-football-beta.p.rapidapi.com/fixtures",
    params: {
      to: futureLocalDate,
      season: season,
      league: req.query.leagueId,
      from: localDate,
    },
    headers: {
      "X-RapidAPI-Key": "ce9352625bmsh696018192ac810ap154737jsn455dc1574f86",
      "X-RapidAPI-Host": "api-football-beta.p.rapidapi.com",
    },
  };

  const response = await axios.request(options);
  const result = Object.values(
    response.data.response.reduce((acc, cur) => {
      const date = cur.fixture.date.split("T")[0];
      acc[date] = acc[date] || [];
      acc[date].push(cur);
      return acc;
    }, {})
  );
  console.log(result, "result");

  res.status(200).json({
    status: "success",
    data: result,
  });
});
