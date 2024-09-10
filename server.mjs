import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import router from "./routes/index.mjs";
import connectMongoDB from "./connectMongoDB.js";
import cookieParser from "cookie-parser";
import cors from 'cors';

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.KEY_COOKIE_SERCRET));
app.use(cors({
  origin: process.env.CLIENT_URL, 
}));
app.use(express.static('public')); 

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
  connectMongoDB();
});

app.use(router);
