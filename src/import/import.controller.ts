import { Request, Response } from "express";
import { parseCsv } from "./import.service";

export const uploadCsv = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const rows = await parseCsv(req.file.path);

    return res.status(200).json({
    success: true,
    totalRows: rows.length,
    firstRow: rows[0],
});
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Import failed",
    });
  }
};