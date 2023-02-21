import express, {request} from "express";
import {ObjectId} from "mongodb";

export function ActivityApi(db){
    const api = express.Router();

    // might need to change this to managerID and require manager cookies depending on the page
    api.get("/", async (req,res) => {
        const employeeId = req.cookies.employee;

        if (!employeeId) {
            res.sendStatus(403);
            return;
        }

        const activities = await db.collection("activity")
            .find({ employeeId: employeeId })
            .toArray();

        res.send(activities);
    })

    api.post("/", async (req, res) => {
        if (!req.cookies.manager) {
            res.sendStatus(403);
            return;
        }

        const { activityName, department } = req.body;

        const result = await db.collection("activity")
            .insertOne({ activityName, department});

        res.sendStatus(200);
    });

    api.put("/", async (req, res) => {
        if (!req.cookies.manager) {
            res.sendStatus(403);
            return;
        }

        const { id, activityName, department } = req.body;

        await db.collection("activity")
            .updateOne(
                { _id: new ObjectId(id) },
                { $set: { activityName, department } }
            );

        res.sendStatus(200);
    });

    api.delete("/", async (req, res) => {
        const { id } = req.body;

        if (!id) {
            res.sendStatus(404);
            return;
        }

        if (!req.cookies.manager) {
            res.sendStatus(403);
            return;
        }

        const result = await db.collection("activity")
            .deleteOne({ _id: new ObjectId(id) });

        res.sendStatus(200);
    });

    return api;
}