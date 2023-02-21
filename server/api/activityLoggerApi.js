import express, {request} from "express";
import {ObjectId} from "mongodb";

export function ActivityLoggerApi(db){
    const api = express.Router();

    api.get("/", async (req,res) => {
        const employeeId = req.cookies.employee;

        if (!employeeId) {
            res.sendStatus(403);
            return;
        }

        const activitylogs = await db.collection("activitylogs")
            .find({ employeeId: employeeId })
            .toArray();

        res.send(activitylogs);
    })

    api.post("/", async (req, res) => {
        const employeeId = req.cookies.employeeId;

        if (!employeeId) {
            res.sendStatus(403);
            return;
        }

        const activity = {
            ...req.body,
            employeeId,
        };

        await db.collection("activitylogs")
            .insertOne(activity);

        res.sendStatus(200);
    });

    api.delete("/", async (req, res) => {
        const { id } = req.body;

        if (!id) {
            res.sendStatus(404);
            return;
        }

        if (!req.cookies.employee) {
            res.sendStatus(403);
            return;
        }

        const result = await db.collection("activitylogs")
            .deleteOne({ _id: new ObjectId(id) });

        res.sendStatus(200);
    });


    return api;
}