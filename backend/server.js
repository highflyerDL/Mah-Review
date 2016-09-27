require("dotenv").load();
import express from "express";
import passport from "passport";
import authRoutes from "./routes/auth.routes.js";
import mongoose from "mongoose";
import chalk from "chalk";
import "./config/passport";
import bodyParser from "body-parser";
import compression from 'compression';

const app = express();
var path = require("path");
mongoose.connect("mongodb://localhost:27017/mern");
mongoose.connection.on('connected', () => {
  console.log('%s MongoDB connection established!', chalk.green('✓'));
});
mongoose.connection.on('error', () => {
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, '../www')));
app.get('*', function (request, response){
  response.sendFile(path.resolve(__dirname, '../www', 'index.html'))
});
app.use(passport.initialize());

app.use("/api/", authRoutes);
export default app;
