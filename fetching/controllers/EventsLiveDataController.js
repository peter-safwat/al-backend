const fsPromise = require("fs").promises;
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const catchAsync = require("../utils/catchAsync");
const {
  sportCategoryApiDataTypes,
} = require("../utils/sportCategoryApiDataTypes");

const getFootballLineUps = async (eventId, filePath) => {
  const options = {
    method: "GET",
    url: "https://api-football-v1.p.rapidapi.com/v3/fixtures/lineups",
    params: { fixture: eventId },
    headers: {
      "X-RapidAPI-Key": "921f373660msha3e0d928464b8e4p198461jsn4e6138ae0d40",
      "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    console.dir(response.data.response);
    const jsonData = JSON.stringify(response.data.response, null, 2); // The third parameter is for indentation (2 spaces in this case)

    // Write the data to the file
    fs.writeFile(filePath, jsonData, (err) => {
      if (err) {
        console.error(`Error writing to file ${filePath}: ${err.message}`);
      } else {
        console.log(`Data written to file ${filePath} successfully.`);
      }
    });
  } catch (error) {
    console.error(error);
  }
};
const getFootballstatistics = async (eventId, filePath) => {
  const options = {
    method: "GET",
    url: "https://api-football-v1.p.rapidapi.com/v3/fixtures/statistics",
    params: { fixture: eventId },
    headers: {
      "X-RapidAPI-Key": "921f373660msha3e0d928464b8e4p198461jsn4e6138ae0d40",
      "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    const jsonData = JSON.stringify(response.data.response, null, 2); // The third parameter is for indentation (2 spaces in this case)

    // Write the data to the file
    fs.writeFile(filePath, jsonData, (err) => {
      if (err) {
        console.error(`Error writing to file ${filePath}: ${err.message}`);
      } else {
        console.log(`Data written to file ${filePath} successfully.`);
      }
    });
  } catch (error) {
    console.error(error);
  }
};

const getFootballEvents = async (eventId, filePath) => {
  const options = {
    method: "GET",
    url: "https://api-football-v1.p.rapidapi.com/v3/fixtures/events",
    params: { fixture: eventId },
    headers: {
      "X-RapidAPI-Key": "921f373660msha3e0d928464b8e4p198461jsn4e6138ae0d40",
      "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    const jsonData = JSON.stringify(response.data.response, null, 2); // The third parameter is for indentation (2 spaces in this case)

    // Write the data to the file
    fs.writeFile(filePath, jsonData, (err) => {
      if (err) {
        console.error(`Error writing to file ${filePath}: ${err.message}`);
      } else {
        console.log(`Data written to file ${filePath} successfully.`);
      }
    });
  } catch (error) {
    console.error(error);
  }
};
const getOthersLineUps = async (eventId, filePath) => {
  const options = {
    method: "GET",
    url: "https://divanscore.p.rapidapi.com/matches/get-lineups",
    params: {
      matchId: eventId,
    },
    headers: {
      "X-RapidAPI-Key": "921f373660msha3e0d928464b8e4p198461jsn4e6138ae0d40",
      "X-RapidAPI-Host": "divanscore.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    const jsonData = JSON.stringify(response.data, null, 2); // The third parameter is for indentation (2 spaces in this case)

    // Write the data to the file
    fs.writeFile(filePath, jsonData, (err) => {
      if (err) {
        console.error(`Error writing to file ${filePath}: ${err.message}`);
      } else {
        console.log(`Data written to file ${filePath} successfully.`);
      }
    });
  } catch (error) {
    console.error(error);
  }
};
const getOthersstatistics = async (eventId, filePath) => {
  const options = {
    method: "GET",
    url: "https://divanscore.p.rapidapi.com/matches/get-statistics",
    params: { matchId: eventId },
    headers: {
      "X-RapidAPI-Key": "921f373660msha3e0d928464b8e4p198461jsn4e6138ae0d40",
      "X-RapidAPI-Host": "divanscore.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    const jsonData = JSON.stringify(response.data.statistics, null, 2); // The third parameter is for indentation (2 spaces in this case)
    // Write the data to the file
    fs.writeFile(filePath, jsonData, (err) => {
      if (err) {
        console.error(`Error writing to file ${filePath}: ${err.message}`);
      } else {
        console.log(`Data written to file ${filePath} successfully.`);
      }
    });
  } catch (error) {
    console.error(error);
  }
};

const getOthersSummery = async (eventId, filePath) => {
  const options = {
    method: "GET",
    url: "https://divanscore.p.rapidapi.com/matches/get-statistics",
    params: { matchId: eventId },
    headers: {
      "X-RapidAPI-Key": "921f373660msha3e0d928464b8e4p198461jsn4e6138ae0d40",
      "X-RapidAPI-Host": "divanscore.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    const jsonData = JSON.stringify(response.data.response, null, 2); // The third parameter is for indentation (2 spaces in this case)

    // Write the data to the file
    fs.writeFile(filePath, jsonData, (err) => {
      if (err) {
        console.error(`Error writing to file ${filePath}: ${err.message}`);
      } else {
        console.log(`Data written to file ${filePath} successfully.`);
      }
    });
  } catch (error) {
    console.error(error);
  }
};

const getDataForFootballLiveEvents = catchAsync(async (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    return;
  }
  const fileList = await fsPromise.readdir(folderPath);

  const currentTime = new Date().getTime() / 1000;
  const filteredFiles = fileList.filter((fileName) => {
    const [, eventId, timestamp] = fileName.match(/(\d+)-(\d+)\.json/) || [];
    return eventId && timestamp && parseInt(timestamp) < currentTime;
  });
  const eventPromises = filteredFiles.map(async (fileName) => {
    const [, eventId] = fileName.match(/(\d+)-\d+\.json/) || [];
    const filePath = path.join(folderPath, fileName);
    if (eventId) {
      if (folderPath.includes("Lineups")) {
        getFootballLineUps(eventId, filePath);
      } else if (folderPath.includes("Statistics")) {
        getFootballstatistics(eventId, filePath);
      } else {
        getFootballEvents(eventId, filePath);
      }
    }
  });
});
const getDataForOtherSportslLiveEvents = catchAsync(async (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    return;
  }
  const fileList = await fsPromise.readdir(folderPath);
  // console.log(folderPath);

  const currentTime = new Date().getTime() / 1000;
  const filteredFiles = fileList.filter((fileName) => {
    const [, eventId, timestamp] = fileName.match(/(\d+)-(\d+)\.json/) || [];
    return eventId && timestamp && parseInt(timestamp) < currentTime;
  });
  const eventPromises = filteredFiles.map(async (fileName) => {
    const [, eventId] = fileName.match(/(\d+)-\d+\.json/) || [];
    const filePath = path.join(folderPath, fileName);
    if (eventId) {
      if (folderPath.includes("Lineups")) {
        getOthersLineUps(eventId, filePath);
      } else if (folderPath.includes("Statistics")) {
        getOthersstatistics(eventId, filePath);
      }
      //  else if (folderPath.includes("events")) {
      //   getOthersstatistics(eventId, filePath);
      // }
      else if (folderPath.includes("Summery")) {
        getOthersSummery(eventId, filePath);
      }
    }
  });
});

exports.gitFootballLiveMatchesData = catchAsync(async (req, res, next) => {
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().substring(0, 10);
  const { dataTypes } = sportCategoryApiDataTypes.find(
    (item) => item.sport === "football"
  );
  for (let i = 0; i < dataTypes.length; i = i + 1) {
    const folderPath = path.join(
      __dirname,
      "../",
      "../",
      "APIdata",
      "Matches",
      "Football",
      dataTypes[i],
      formattedDate
    );

    getDataForFootballLiveEvents(folderPath);
  }
});

exports.gitOtherSportsLiveMatchesData = catchAsync(async (req, res, next) => {
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().substring(0, 10);

  (async () => {
    const types = ["Lineups", "Events", "Statistics"];
    for (let j = 0; j < types.length; j = j + 1) {
      const folderPath = path.join(
        __dirname,
        "../",
        "../",
        "APIdata",
        "Matches",
        "Others",
        types[j],
        formattedDate
      );
      // eslint-disable-next-line no-await-in-loop
      getDataForOtherSportslLiveEvents(folderPath);
    }
  })();
});
