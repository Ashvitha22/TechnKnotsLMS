import express from "express";
import cors from "cors";
import { judge } from "./judgeController.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.post("/api/judge", judge);

app.listen(5000, () => {
  console.log("🚀 Judge backend running on http://localhost:5000");
});
