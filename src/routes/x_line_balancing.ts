import { Router } from "express";
import { FnLineBalancing } from "../services/fn_line_balancing";
import LineHeader from "../models/m_line_header";

export const XLineBalancingRoutes = Router();

const path = '/x-line-balancing';

//1. Takttime = 60/unit per hour
XLineBalancingRoutes.route(path + '/unit-per-hour-to-takt-time').put(async (req, res) => {
    try {
        const {
            line_header_id,
            unit_per_hour
        } = req.body;

        const takt_time = FnLineBalancing.unitPerHourToTaktTime(unit_per_hour);

        await LineHeader.updateOne({_id: line_header_id}, {unit_per_hour: unit_per_hour, takt_time: takt_time});

        res.status(200).json({
            takt_time
        });
    } catch (error: any) {
        if (error.status) res.status(error.status).send(error.message);
        else res.status(400).send(error);
    }
});

//2. Unit per hour = Takttime * 60
XLineBalancingRoutes.route(path + '/takt-time-to-unit-per-hour').put(async (req, res) => {
    try {
        const {
            line_header_id,
            takt_time
        } = req.body;

        const unit_per_hour = FnLineBalancing.taktTimeToUnitPerHour(takt_time);

        await LineHeader.updateOne({_id: line_header_id}, {takt_time: takt_time, unit_per_hour: unit_per_hour});

        res.status(200).json({
            unit_per_hour
        });
    } catch (error: any) {
        if (error.status) res.status(error.status).send(error.message);
        else res.status(400).send(error);
    }
});

//3. Cycle time max = ค่า cycletime ที่สูงสุดจาก details ทั้งหมด
XLineBalancingRoutes.route(path + '/find-cycle-time-max').put(async (req, res) => {
    try {
        const {
            line_header_id,
            line_details
        } = req.body;

        const cycle_time_max = FnLineBalancing.findCycleTimeMax(line_details);

        res.status(200).json({
            cycle_time_max
        });
    } catch (error: any) {
        if (error.status) res.status(error.status).send(error.message);
        else res.status(400).send(error);
    }
});

//3.1 total cycle time
XLineBalancingRoutes.route(path + '/total-cycle-time').put(async (req, res) => {
    try {
        const {
            line_header_id,
            line_details
        } = req.body;

        const total_cycle_time = FnLineBalancing.totalCycleTime(line_details);

        res.status(200).json({
            total_cycle_time
        });
    } catch (error: any) {
        if (error.status) res.status(error.status).send(error.message);
        else res.status(400).send(error);
    }
});

//4. %OTP Bottleneck = (Takttime / Cycle time max) * 100
XLineBalancingRoutes.route(path + '/percent-otp-bottleneck').put(async (req, res) => {
    try {
        const {
            line_header_id,
            takt_time,
            cycle_time_max
        } = req.body;

        const percent_otp_bottleneck = FnLineBalancing.percentOTPBottleneck(takt_time, cycle_time_max);

        res.status(200).json({
            percent_otp_bottleneck
        });
    } catch (error: any) {
        if (error.status) res.status(error.status).send(error.message);
        else res.status(400).send(error);
    }
});

//5. %Balance = (Total Cycle Time * 100%) / (Cycle Time Max * Workstations)
XLineBalancingRoutes.route(path + '/percent-balance').put(async (req, res) => {
    try {
        const {
            line_header_id,
            total_cycle_time,
            cycle_time_max,
            workstation_count
        } = req.body;

        const percent_balance = FnLineBalancing.percentBalance(total_cycle_time, cycle_time_max, workstation_count);

        res.status(200).json({
            percent_balance
        });
    } catch (error: any) {
        if (error.status) res.status(error.status).send(error.message);
        else res.status(400).send(error);
    }
});

//6. Bottleneck Station = สถานีงานที่เป็นคอขวดในสายการผลิต หรือหมายถึงสถานีงานที่มี Cycle Time Max
XLineBalancingRoutes.route(path + '/find-bottleneck-station').put(async (req, res) => {
    try {
        const {
            line_header_id,
            line_details
        } = req.body;

        const bottleneck_station = FnLineBalancing.findBottleneckStation(line_details);

        res.status(200).json({
            bottleneck_station
        });
    } catch (error: any) {
        if (error.status) res.status(error.status).send(error.message);
        else res.status(400).send(error);
    }
});

//7. Bootleneck Output = 60 /  Cycle Time Max
XLineBalancingRoutes.route(path + '/bottleneck-output').put(async (req, res) => {
    try {
        const {
            line_header_id,
            cycle_time_max
        } = req.body;

        const bottleneck_output = FnLineBalancing.bottleneckOutput(cycle_time_max);

        res.status(200).json({
            bottleneck_output
        });
    } catch (error: any) {
        if (error.status) res.status(error.status).send(error.message);
        else res.status(400).send(error);
    }
});

//8. Total Workstation = จำนวนสถานีงานทั้งหมด
XLineBalancingRoutes.route(path + '/total-workstation').put(async (req, res) => {
    try {
        const {
            line_header_id,
            line_details
        } = req.body;

        const total_workstation = FnLineBalancing.totalWorkstation(line_details);

        res.status(200).json({
            total_workstation
        });
    } catch (error: any) {
        if (error.status) res.status(error.status).send(error.message);
        else res.status(400).send(error);
    }
});

//9. Column Status ใน table = (Sum Cycle Time ของสถานีงานนั้น / Takttime) * 100
//    9.1. ค่ามากกว่า takttime แสดง bg red
//    9.2. ค่าเท่ากับ takttime แสดง bg yellow
//    9.3. (80% ของ takttime) > Column Status < 100 แสดง bg green
//    9.4. ค่าน้อยกว่าหรือเท่ากับ 80% ของ takttime bg สีส้ม
XLineBalancingRoutes.route(path + '/total-workstation').put(async (req, res) => {
    try {
        const {
            line_header_id,
            line_details
        } = req.body;

        const total_workstation = FnLineBalancing.totalWorkstation(line_details);

        res.status(200).json({
            total_workstation
        });
    } catch (error: any) {
        if (error.status) res.status(error.status).send(error.message);
        else res.status(400).send(error);
    }
});