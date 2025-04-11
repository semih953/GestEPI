//********** Imports **********//
import express from "express";
import cors from "cors";
import * as middlewares from "./middlewares";
import epiController from "./pages/epiController";
// import epiCheckController from "./pages/epiCheckController";
import userController from "./pages/userController";

require("dotenv").config();

//********** Server **********//
const allowedOrigins = ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "http://localhost:3001", "http://127.0.0.1:3001",];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
  allowedHeaders: 'Content-Type,Authorization',
  methods: 'GET,POST,PUT,DELETE,PATCH',
  credentials:true
};
// Initializing express.
const app = express();
// Enable CORS
app.use(cors(options));
// Middleware to parse json throught requests.
app.use(express.json());

app.use("/epi", epiController);
// app.use("/epiCheck", epiCheckController);
app.use("/users", userController);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;