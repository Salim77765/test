const express = require('express');
const mongoose = require('mongoose');
const app = require('../app');

const dbUrl = process.env.ATLASDB_URL;

async function connectDB() {
    try {
        await mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to DB");
    } catch (err) {
        console.error("Database Connection Error:", err);
        throw err;
    }
}

module.exports = async (req, res) => {
  try {
    // Ensure database connection
    await connectDB();

    // Use the existing Express app as a handler
    return app(req, res);
  } catch (error) {
    console.error('Serverless Function Error:', error);
    res.status(500).json({ 
      message: 'Internal Server Error', 
      error: error.message 
    });
  }
};