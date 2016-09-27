require("dotenv").load();
import express from "express";
import passport from "passport";
import apiRoutes from "./routes/index.js";
import "./config/passport";
import bodyParser from "body-parser";
import compression from 'compression';
import path from "path";
const app = express();

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, '../www')));
app.get('*', function (request, response){
  response.sendFile(path.resolve(__dirname, '../www', 'index.html'))
});
app.use(passport.initialize());

app.use("/api/", apiRoutes);
export default app;
