import expiredSessionCleanup from "./src/utils/sessionExpiry.js";
import envChecks from "./src/utils/envChecks.js";
import connectDB from "./src/db/connectDB.js";
import app from "./src/app.js";

envChecks()
  .then(async () => {
    connectDB().then(() => {
      app.listen(3000, () => {
        expiredSessionCleanup();
        console.log(`>> app is running on http://localhost:3000/ `);
      });
    });
  })
  .catch((error) => console.log(error.message));
