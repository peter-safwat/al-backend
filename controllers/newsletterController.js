const PDFDocument = require("pdfkit");
const fs = require("fs");

const Newsletter = require("../models/newsletterModel");
const factory = require("./handlerFactory");

exports.getAllUsers = factory.getAll(Newsletter);
exports.addUser = factory.createOne(Newsletter);
exports.deleteUser = factory.deleteOne(Newsletter);
exports.downloadAllEmails = async (req, res) => {
  try {
    const users = await Newsletter.find({}, "email").exec();

    // Create a new PDF document
    const doc = new PDFDocument();

    // Set response headers to download the file
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=emails.pdf");

    // Pipe the PDF stream to the response
    doc.pipe(res);

    // Add email data to the PDF
    doc.text("List of Emails");
    doc.moveDown();
    users.forEach((user) => {
      doc.text(user.email);
    });

    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Do NOT update passwords with this!

// Do NOT update passwords with this!
