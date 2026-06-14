"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCsv = void 0;
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const parseCsv = (filePath) => {
    return new Promise((resolve, reject) => {
        const rows = [];
        fs_1.default.createReadStream(filePath)
            .pipe((0, csv_parser_1.default)())
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
exports.parseCsv = parseCsv;
