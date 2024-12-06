import { Router } from "express";
import Workspace from "../models/m_workspace";

export const WorkspaceRoutes = Router();

const path = '/workspace';

WorkspaceRoutes.route(path + '/by-user/:user_id').get(async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const workspaces = await Workspace.find({ user_id: user_id });

        // Send the workspaces in the response
        res.status(200).json({
            message: `Workspaces found.`,
            workspaces,
        });
    } catch (error: any) {
        if (error.status) res.status(error.status).send(error.message);
        else res.status(400).send(error);
    }
});