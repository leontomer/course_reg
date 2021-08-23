const express = require("express");
const connectDB = require("./config/db");
const app = express();
const path = require("path");
const http = require("http");
const server = http.createServer(app);

const actionsApi = require("./routes/api/actionsAPI");
const authAPI = require("./routes/api/authAPI");
connectDB();
const port = process.env.PORT || 5000;
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: false }));
app.use("/actions", actionsApi);
app.use("/auth", authAPI);

server.listen(port, () => console.log(`server is running on port ${port}`));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
