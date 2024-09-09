import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import connectMongoDB from "./connectMongoDB";

dotenv.config();
const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
  connectMongoDB();
});

app.get("/api/ticket", ticketRoutes);


