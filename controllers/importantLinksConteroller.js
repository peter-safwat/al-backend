const ImportedLinks = require("../models/ImportantLinksModel");
const factory = require("./handlerFactory");

exports.createImportedLinks = factory.createOne(ImportedLinks);
exports.updateImportedLinks = factory.updateOne(ImportedLinks);
exports.getAllImportedLinks = factory.getAll(ImportedLinks);
