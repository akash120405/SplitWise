import { Request, Response } from "express";

export const uploadCsv = (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    return res.status(200).json({
      success: true,
      filename: req.file.originalname,
      size: req.file.size,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Upload failed",
    });
  }
};