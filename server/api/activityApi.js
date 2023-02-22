import express, {request} from "express";
import {ObjectId} from "mongodb";

export function ActivityApi(db){
    const api = express.Router();


    api.get("/", async (req, res) => {

        const managerId = req.cookies.manager;

        if (!managerId) {
            res.sendStatus(403);
            return;
        }





        const activityItems = await db.collection("activity")
            .find()
            .map(({ _id, activityName, department }) => ({
                id: _id,
                activityName,
                department,

            }))
            .toArray();

        res.json(activityItems)
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


    api.get("/department", async (req, res) => {

        const employeeId = req.cookies.employee;

        if (!employeeId) {
            res.sendStatus(403);
            return;
        }

        const employee = await db.collection("employee")
            .findOne({ _id: new ObjectId(req.cookies.employee) });

        const department = employee.department;

        const relevantDepartment = await db.collection("activity")
            .find({department: department})
            .toArray();

        res.json(relevantDepartment)


    })

    return api;
}