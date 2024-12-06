import { Router } from "express";
import XModel from "../models/m_model";

export const ModelRoutes = Router();

const path = '/model';

ModelRoutes.route(path).post(async (req, res) => {
    try {
        const {
            user_id,
            workspace_id,
            name,
            code
        } = req.body;

        const newLine = new XModel({
            user_id: user_id,
            workspace_id: workspace_id,
            name: name,
            code: code
        });

        await newLine.save();

        res.status(201).json({
            message: 'Model created successfully.',
            line: newLine,
        });
    } catch (error: any) {
        if (error.status) res.status(error.status).send(error.message);
        else res.status(400).send(error);
    }
});

ModelRoutes.route(path + '/by-workspace/:workspace_id').get(async (req, res) => {
    try {
        const workspace_id = req.params.workspace_id;

        const models = await XModel.find({workspace_id: workspace_id});

        if (models.length === 0) {
            res.status(404).json({
                message: `No models found.`,
            });
        } else {
            // Send the models in the response
            res.status(200).json({
                message: `Models found.`,
                models,
            });
        }
    } catch (error: any) {
        if (error.status) res.status(error.status).send(error.message);
        else res.status(400).send(error);
    }
});