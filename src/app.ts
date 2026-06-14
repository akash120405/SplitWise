import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes";
import groupRoutes from "./routes/group.routes";
import expenseRoutes from "./routes/expense.routes";
import importRoutes from "./import/import.routes";
import balanceRoutes from "./routes/balance.routes";
import settlementRoutes from "./routes/settlement.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Splitwise API Running");
});
app.use(
  "/api/groups",
  balanceRoutes
);
app.use(
  "/api/groups",
  settlementRoutes
);
app.use("/api/auth", authRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api", importRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});