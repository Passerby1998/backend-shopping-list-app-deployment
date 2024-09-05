import express from "express";
import cors from "cors"; // Import the cors package
import router from "./routes/routes.js";
import database from "./database/connection.js";

const app = express();
const PORT = 3000;

// middleware
app.use(cors()); // Enable CORS for all routes and origins
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use(router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
