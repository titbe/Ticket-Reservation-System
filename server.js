import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import connectMongoDB from "./connectMongoDB";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cookieParser(process.env.KEY_COOKIE_SERCRET))

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
  connectMongoDB();
});

app.get("/api/ticket", ticketRoutes);


