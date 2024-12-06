import { Router } from "express";
import Line from "../models/m_line";

export const LineRoutes = Router();

const path = '/line';

LineRoutes.route(path).post(async (req, res) => {
    try {
        const {
            user_id,
            workspace_id,
            name,
            code
        } = req.body;

        const newLine = new Line({
            user_id: user_id,
            workspace_id: workspace_id,
            name: name,
            code: code
        });

        await newLine.save();

        res.status(201).json({
            message: 'Line created successfully.',
            line: newLine,
        });
    } catch (error: any) {
        if (error.status) res.status(error.status).send(error.message);
        else res.status(400).send(error);
    }
});

LineRoutes.route(path + '/by-workspace/:workspace_id').get(async (req, res) => {
    try {
        const workspace_id = req.params.workspace_id;

        const lines = await Line.find({ workspace_id: workspace_id });

        res.status(200).json({
            message: `Lines found.`,
            lines,
        });
    } catch (error: any) {
        if (error.status) res.status(error.status).send(error.message);
        else res.status(400).send(error);
    }
});