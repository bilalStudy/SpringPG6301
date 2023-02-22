import express from "express";
import {ObjectId} from "mongodb";


export function ManagerApi(db){
    const api = express.Router();


    api.post("/login", async (req, res) => {
        const { username, password } = req.body;

        if (!username || username.length === 0) {
            res.sendStatus(404);
            return;
        }

        if (!password || password.length === 0) {
            res.sendStatus(404);
            return;
        }

        const managers = await db.collection("manager")
            .find({ username: username, password: password })
            .toArray();

        if (managers.length == 0) {
            res.sendStatus(404);
            return;
        }

        const manager = managers[0];

        res.json({
            cookie: manager._id,
            manager: manager,
        });
    })

    api.get("/logged-in", async (req, res) => {
        if (!req.cookies.manager) {
            res.sendStatus(403);
            return;
        }

        const manager = await db.collection("manager")
            .findOne({ _id: new ObjectId(req.cookies.manager) });

        res.send(manager);
    });


    return api;
}