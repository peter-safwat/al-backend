const fs = require("fs");
const path = require("path");

const bannedMembersPath = path.join(
  __dirname,
  "../",
  "../",
  "activeMembers.json"
);

exports.deletMutedBannedIp = async (req, res, next) => {
  fs.writeFileSync(bannedMembersPath, JSON.stringify([], null, 2), "utf8");
  console.log("muted Members reset");
};
