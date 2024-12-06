import { Router } from "express";
import { PasswordGen } from "../services/password_gen";
import User from "../models/m_user";
import Workspace from "../models/m_workspace";

export const UserRoutes = Router();

const path = '/user';

//REGISTER
UserRoutes.route(path + '/register').post(async (req, res) => {
    try {
        const { email, password, display_name, workspace_name } = req.body;

        // Hash the password using MD5
        const password_hash = PasswordGen.generateMD5Password(password);

        // Create a new User document
        const newUser = new User({
            email,
            password_hash,
            display_name
        });

        // Save the new user to the database
        await newUser.save();

        const newWorkspace = new Workspace({
            user_id: newUser.id,
            name: workspace_name ?? `${display_name}'s Workspace.`
        });

        await newWorkspace.save();

        // Send the created user back in the response (password_hash is excluded)
        res.status(201).json({
            message: 'User registered successfully.',
            user: newUser,
            workspaces: [newWorkspace]
        });
    } catch (error: any) {
        if (error.status) res.status(error.status).send(error.message);
        else res.status(400).send(error);
    }
});

//LOGIN
UserRoutes.route(path + '/login').post(async (req, res) => {
    try {
        const { email, password } = req.body;

        // Hash the password using MD5
        const password_hash = PasswordGen.generateMD5Password(password);

        // Create a new User document
        const user = await User.findOne({email: email, password_hash: password_hash});

        if(!user){
            res.status(404).json({
                message: 'Login failed: incorrect email or password.'
            });
        }else{
            const workspaces = await Workspace.find({user_id: user.id});
            res.status(200).json({
                message: 'User logged in successfully.',
                user: user,
                workspaces: workspaces
            });
        }
    } catch (error: any) {
        if (error.status) res.status(error.status).send(error.message);
        else res.status(400).send(error);
    }
});

//GET
UserRoutes.route(path + '/:id').get(async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            res.status(404).json({ message: 'User not found.' });
        }else{
            // Send the user document (password_hash will not be included)
            res.status(200).json(user);
        }
    } catch (error: any) {
        if (error.status) res.status(error.status).send(error.message);
        else res.status(400).send(error);
    }
});