const Administrator = require("../models/administratorModel");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "name", "email");

  // 3) Update user document
  const updatedUser = await Administrator.findByIdAndUpdate(
    req.user.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await Administrator.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.createUser = factory.createOne(Administrator);
exports.getUser = factory.getOne(Administrator);
exports.getAllUsers = factory.getAll(Administrator);
exports.deleteManyUsers = factory.deleteMany(Administrator);

// Do NOT update passwords with this!
exports.updateUser = factory.updateOne(Administrator);
exports.deleteUser = factory.deleteOne(Administrator);

// reguler users
exports.loginUser = catchAsync(async (req, res, next) => {
  const user = { ...req.body };
  const exist = await User.findOne({ email: user.email });
  if (exist) {
    res.status(201).json({
      status: "success",
      data: {
        data: exist,
      },
    });
    return;
  }
  let existingUsernameUser = await User.findOne({ name: user.name });
  if (existingUsernameUser) {
    // If the username already exists, generate a new one
    let randomThreeDigitNumber;
    do {
      randomThreeDigitNumber = Math.floor(Math.random() * 900) + 100;
      user.name += randomThreeDigitNumber;
      existingUsernameUser = await User.findOne({ name: user.name });
    } while (existingUsernameUser);
  }

  const doc = await User.create(user);
  res.status(201).json({
    status: "success",
    data: {
      data: doc,
    },
  });
});
exports.updateRegulerUser = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const user = { ...req.body };

  const userExist = await User.findOne({ email: user.email });
  if (!userExist) {
    res.status(404).json({
      status: "fail",
      message:
        "this email is not connected to the website , please login and continue",
    });
    return;
  }
  const nameTaken = await User.findOne({ name: user.name });
  if (nameTaken) {
    return res.status(409).json({
      status: "fail",
      message: "name already exists",
    });
  }
  const updatedUser = await User.findOneAndUpdate(
    { email: user.email },
    { name: user.name },
    {
      new: true, // Return the modified document
      runValidators: true, // Run validators on update
    }
  );
  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});
exports.checkUsernameAvailability = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    res.status(404).json({
      status: "fail",
      message: "please enter a username",
    });
    return;
  }

  const nameTaken = await User.findOne({ name: name });
  console.log(name);
  console.log(nameTaken);
  if (nameTaken) {
    res.status(409).json({
      status: "fail",
      message: "this username is already exists",
    });
    return;
  }
  res.status(200).json({
    status: "success",
    data: {
      name: name,
    },
  });
});
exports.createTempUser = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    res.status(404).json({
      status: "fail",
      message: "please enter a username",
    });
    return;
  }

  const nameTaken = await User.findOne({ name: name });
  if (nameTaken) {
    res.status(409).json({
      status: "fail",
      message: "this username is already exists",
    });
    return;
  }
  const newUser = await User.create({ name: name });

  res.status(200).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});
