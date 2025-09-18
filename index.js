const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv")
const cors = require("cors");

const app = express();

// ROUTES
const authRoute = require("./src/routes/authRoute");
const walletRoute = require("./src/routes/walletRoute");

dotenv.config();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoute);
// app.use('/api/wallet', walletRoute);

app.get('/',  (req, res) => {
    res.send('Welcome to Cache Wallet API');
})

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed", err);
  });
