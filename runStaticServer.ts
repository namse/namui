import express from "express";
import path from "path";
const app = express();

app.use("/build", express.static("build"));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
app.get("/index.html", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen("8080", () => {
  console.log("port on 8080");
});
