const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("🚀 Node.js App Deployed on Cloud Run with Terraform!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
