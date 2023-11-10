import mongoose from "mongoose";
import app from "./app";

// Database
mongoose
  .connect(process.env.DB_CONNECTION as string)
  .then(() => {
    console.log('Connected to database...')
  })
  .catch((err) => {
    console.log(err)
    process.exit(1)
  })

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});