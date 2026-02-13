import express from "express";
const app = express();

app.get("/", (req, res) => {
  res.send("Apex Brain API Running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server on " + PORT));
