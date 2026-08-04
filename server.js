import expiredSessionCleanup from "./src/utils/sessionexpiry.js";
import connectDB from "./src/db/connectDB.js";
import app from "./src/app.js";
import dotenv from "dotenv";
dotenv.config();

connectDB()
  .then(() => {
    const defaultVlues = {
      ACCESS_TOKEN_AGE: "15m",
      ACCESS_TOKEN_EXPIRE: "15m",
      REFRESH_TOKEN_AGE: "7d",
      REFRESH_TOKEN_EXPIRE: "7d",
    };

    const envVariables = [
      "ACCESS_TOKEN_AGE",
      "ACCESS_TOKEN_EXPIRE",
      "REFRESH_TOKEN_AGE",
      "REFRESH_TOKEN_EXPIRE",
    ];

    for (let key of envVariables) {
      if (!Object.keys(process.env).includes(key))
        throw new Error(`Missing environment variable : ${key}`);

      process.env[key] ??= defaultVlues[key];
    }

    const requiredVaribales = ["REFRESH_TOKEN_SECRET", "ACCESS_TOKEN_SECRET"];
    for (let key of requiredVaribales) {
      if (!process.env[key])
        throw new Error(`Missing environment variable : ${key}`);
    }
    console.log(">> env Varibales loaded successfuuly.")
    expiredSessionCleanup();
  })
  .then(() => {
    app.listen(3000, () => {
      console.log(`>> app is running on http://localhost:3000/ `);
    });
  })
  .catch((error) => console.log(error.message));
