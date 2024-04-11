const catchAsync = require("../utils/catchAsync");
const Sport = require('../../models/sportModel'); 

exports.deletOldSportsEvents = catchAsync(async (req, res, next) => {
  const currentTime = new Date();
  const result = await Sport.deleteMany({
    removeStream: { $lte: currentTime },
  });

  res
    .status(200)
    .json({
      message: `${result.deletedCount} document(s) deleted successfully.`,
    });
});
