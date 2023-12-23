const mongoose = require("mongoose");

const CustomAPISchema = new mongoose.Schema({
  customAPIData: {},
});
const CustomAPI = mongoose.model("CustomAPI", CustomAPISchema);

module.exports = CustomAPI;
