const catchAsync = require("../utils/catchAsync");
const Sport = require('../../models/sportModel'); // Replace 'YourModel' with the name of your Mongoose model

exports.deletOldSportsEvents = catchAsync(async (req, res, next) => {
  const currentTime = new Date();

  // Find and delete documents where 'removeStream' is less than or equal to the current time
  const result = await Sport.deleteMany({
    removeStream: { $lte: currentTime },
  });

  res
    .status(200)
    .json({
      message: `${result.deletedCount} document(s) deleted successfully.`,
    });
});
