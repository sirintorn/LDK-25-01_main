import { Router } from "express";
import LineHeader from "../models/m_line_header";
import LineDetail from "../models/m_line_detail";

export const LineBalancingRoutes = Router();

const path = '/new-line';

//CREATE LINE HEADER
LineBalancingRoutes.route(path + '/header/create').post(async (req, res) => {
    try {
        const {
            user_id,
            workspace_id,
            line_code,
            model_code,
            takt_time,
            unit_per_hour,
            total_cycle_time,
        } = req.body;

        const newLineHeader = new LineHeader({
            user_id,
            workspace_id,
            line_code,
            model_code,
            takt_time,
            unit_per_hour,
            total_cycle_time,
        });

        await newLineHeader.save();

        res.status(201).json({
            message: 'Line Header created successfully.',
            line_header: newLineHeader
        });
    } catch (error: any) {
        if (error.status) res.status(error.status).send(error.message);
        else res.status(400).send(error);
    }
});

//SYNC LINE HEADER => IF NOT EXIST, CREATE NEW ONE
LineBalancingRoutes.route(path + '/header/sync').post(async (req, res) => {
    try {
        const {
            user_id,
            workspace_id,
            line_code,
            model_code,
            takt_time,
            unit_per_hour,
            total_cycle_time,
        } = req.body;

        var lineHeader = await LineHeader.findOne({ user_id: user_id, workspace_id: workspace_id, line_code: line_code, model_code: model_code });

        if (!lineHeader) {
            lineHeader = new LineHeader({
                user_id,
                workspace_id,
                line_code,
                model_code,
                takt_time,
                unit_per_hour,
                total_cycle_time,
            });

            await lineHeader.save();
        }

        res.status(200).json({
            message: `Models found.`,
            line_header: lineHeader
        });
    } catch (error: any) {
        if (error.status) res.status(error.status).send(error.message);
        else res.status(400).send(error);
    }
});

//EDIT LINE HEADER
LineBalancingRoutes.route(path + '/header/edit/:line_header_id').put(async (req, res) => {
    try {
        const line_header_id = req.params.line_header_id;
        const body = req.body;

        await LineHeader.updateOne({ _id: line_header_id }, body);

        res.status(200).json({
            message: `Line header edited.`,
        });
    } catch (error: any) {
        if (error.status) res.status(error.status).send(error.message);
        else res.status(400).send(error);
    }
});


//GET LINE DETAILS BY LINE HEADER ID
LineBalancingRoutes.route(path + '/detail/by-header/:line_header_id').get(async (req, res) => {
    try {
        const line_header_id = req.params.line_header_id;

        const newLineDetails = await LineDetail.find({ line_header_id: line_header_id });

        // Send the LineDetails in the response
        res.status(200).json({
            message: `Line Details found.`,
            line_details: newLineDetails,
        });
    } catch (error: any) {
        if (error.status) res.status(error.status).send(error.message);
        else res.status(400).send(error);
    }
});

//GET LINE DETAIL
LineBalancingRoutes.route(path + '/detail/:id').get(async (req, res) => {
    try {
        const id = req.params.id;

        const newLineDetail = await LineDetail.findOne({ _id: id });

        // Send the LineDetails in the response
        res.status(200).json({
            message: `Line Detail found.`,
            line_detail: newLineDetail,
        });
    } catch (error: any) {
        if (error.status) res.status(error.status).send(error.message);
        else res.status(400).send(error);
    }
});

//CREATE LINE DETAIL
LineBalancingRoutes.route(path + '/detail').post(async (req, res) => {
    try {
        const {
            user_id,
            workspace_id,
            line_header_id,
            cycle_time,
            description, //optional
            employee, //optional
            station,
            step_code,
        } = req.body;

        const newLineDetail = new LineDetail({
            user_id,
            workspace_id,
            line_header_id,
            cycle_time,
            description, //optional
            employee, //optional
            station,
            step_code,
        });

        await newLineDetail.save();

        res.status(201).json({
            message: 'Line Detail created successfully.',
            detail: newLineDetail,
        });
    } catch (error: any) {
        if (error.status) res.status(error.status).send(error.message);
        else res.status(400).send(error);
    }
});

//EDIT LINE DETAIL
LineBalancingRoutes.route(path + '/detail/edit/:line_detail_id').put(async (req, res) => {
    try {
        const line_detail_id = req.params.line_detail_id;
        const body = req.body;

        await LineDetail.updateOne({ _id: line_detail_id }, body);

        res.status(200).json({
            message: `Line detail edited.`,
        });
    } catch (error: any) {
        if (error.status) res.status(error.status).send(error.message);
        else res.status(400).send(error);
    }
});

//DELETE LINE DETAIL
LineBalancingRoutes.route(path + '/detail/delete').delete(async (req, res) => {
    try {
        const { ids } = req.body;

        await LineDetail.deleteMany({ _id: { $in: ids } });

        res.status(200).json({
            message: `Line details deleted.`,
        });
    } catch (error: any) {
        if (error.status) res.status(error.status).send(error.message);
        else res.status(400).send(error);
    }
});