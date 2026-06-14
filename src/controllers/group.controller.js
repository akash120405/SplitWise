"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGroupMembers = exports.leaveGroup = exports.addMember = exports.createGroup = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const createGroup = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Group name is required",
            });
        }
        const group = await prisma_1.default.group.create({
            data: {
                name,
            },
        });
        return res.status(201).json({
            success: true,
            group,
        });
    }
    catch (error) {
        console.error("GROUP ERROR:");
        console.error(error);
        return res.status(500).json({
            success: false,
            error: error?.message,
        });
    }
};
exports.createGroup = createGroup;
const addMember = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const { userId } = req.body;
        const member = await prisma_1.default.groupMember.create({
            data: {
                groupId,
                userId,
            },
        });
        return res.status(201).json({
            success: true,
            member,
        });
    }
    catch (error) {
        console.error("ADD MEMBER ERROR:");
        console.error(error);
        return res.status(500).json({
            success: false,
            error: error?.message,
        });
    }
};
exports.addMember = addMember;
const leaveGroup = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const userId = req.params.userId;
        const member = await prisma_1.default.groupMember.findFirst({
            where: {
                groupId,
                userId,
                leftAt: null,
            },
        });
        if (!member) {
            return res.status(404).json({
                success: false,
                message: "Member not found",
            });
        }
        const updatedMember = await prisma_1.default.groupMember.update({
            where: {
                id: member.id,
            },
            data: {
                leftAt: new Date(),
            },
        });
        return res.json({
            success: true,
            member: updatedMember,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: error?.message,
        });
    }
};
exports.leaveGroup = leaveGroup;
const getGroupMembers = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const members = await prisma_1.default.groupMember.findMany({
            where: {
                groupId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        return res.json({
            success: true,
            members,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: error?.message,
        });
    }
};
exports.getGroupMembers = getGroupMembers;
