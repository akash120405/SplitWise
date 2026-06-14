import express from "express";
import multer from "multer";
import { uploadCsv } from "./import.controller";

const router = express.Router();

const upload = multer({
  dest: "uploads/",
});

router.post("/import", upload.single("file"), uploadCsv);

export default router;