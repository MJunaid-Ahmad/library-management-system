import dotenv from "dotenv";
dotenv.config();

export default async function envChecks() {
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

    process.env[key] = process.env[key] || defaultVlues[key];
  }

  const requiredVaribales = [
    "REFRESH_TOKEN_SECRET",
    "ACCESS_TOKEN_SECRET",
    "MONGODB_URI",
  ];
  for (let key of requiredVaribales) {
    if (!process.env[key])
      throw new Error(`Missing environment variable : ${key}`);
  }
  console.log(">> env Varibales loaded successfuuly.");
}
