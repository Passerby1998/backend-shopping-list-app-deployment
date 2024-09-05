import express from "express";
import cors from "cors"; // Import the cors package
import router from "./routes/routes.js";
import database from "./database/connection.js";

const app = express();
const PORT = 3000;

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions)); // Enable CORS for all routes and origins

// routes
app.use(router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
