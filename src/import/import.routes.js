"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const import_controller_1 = require("./import.controller");
const router = express_1.default.Router();
const upload = (0, multer_1.default)({
    dest: "uploads/",
});
router.post("/import", upload.single("file"), import_controller_1.uploadCsv);
exports.default = router;
