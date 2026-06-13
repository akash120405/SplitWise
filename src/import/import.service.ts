import fs from "fs";
import csv from "csv-parser";

export const parseCsv = (
  filePath: string
): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const rows: any[] = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        rows.push(row);
      })
      .on("end", () => {
        resolve(rows);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
};