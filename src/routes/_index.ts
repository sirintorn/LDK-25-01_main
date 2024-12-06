import { Router } from "express";
import { UserRoutes } from "./r_user";
import { WorkspaceRoutes } from "./r_workspace";
import { LineRoutes } from "./r_line";
import { ModelRoutes } from "./r_model";
import { LineBalancingRoutes } from "./r_line_balancing";
import { XLineBalancingRoutes } from "./x_line_balancing";

export const routes = Router();

routes.use(UserRoutes);
routes.use(WorkspaceRoutes);
routes.use(LineRoutes);
routes.use(ModelRoutes);
routes.use(LineBalancingRoutes);

routes.use(XLineBalancingRoutes);