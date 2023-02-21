import express, {request} from "express";
import {ObjectId} from "mongodb";

export function EmployeeApi(db){
    const api = express.Router();

    api.post("/login", async (req,res) => {
        const {username, password} = req.body;

        const employees = await db.collection("employee")
            .find({username: username, password: password})
            .toArray();

        if (employees.length > 0){
            const employee = employees[0];

            res.json({
                cookie : employee._id.toString(),
                employee: employee,
            })
        }else {
            res.sendStatus(404);
        }
    })

    api.get("/logged-in", async (req,res) => {
        if (!req.cookies.employee || req.cookies.employee.length == 0) {
            res.sendStatus(403);
            return;
        }

        const employee = await db.collection("employee")
            .findOne({ _id: new ObjectId(req.cookies.employee) });

        if (!employee) {
            res.sendStatus(404);
            return;
        }

        res.send(employee);
    })

    api.post("/register", async (req, res) => {
        const { username, fullname, password, department } = req.body;

        if (!username || username.length == 0) {
            res.sendStatus(500);
            return;
        }

        if (!fullname || fullname.length == 0) {
            res.sendStatus(500);
            return;
        }

        if (!password || password.length == 0) {
            res.sendStatus(500);
            return;
        }

        if (!department || department.length == 0) {
            res.sendStatus(500);
            return;
        }

        const employees = await db.collection("employee")
            .find({ username: username })
            .toArray();

        if (employees.length > 0) {
            res.sendStatus(500);
            return;
        }

        const result = db.collection("employee").insertOne({
            username,
            fullname,
            password,
            department,
        });
        res.sendStatus(200);
    })

    api.put("/", async (req,res) => {
        if (!req.cookies.manager){
            res.sendStatus(403);
            return;
        }

        const { id, username, fullname, password, department } = req.body;

        await db.collection("employee")
            .updateOne(
                { _id: new ObjectId(id) },
                { $set: { username, fullname, password, department } }
            );

        res.sendStatus(200);
    })

    api.delete("/", async (req,res) => {
        const { id } = req.body;

        if (!id) {
            res.sendStatus(404);
            return;
        }

        if (!req.cookies.manager) {
            res.sendStatus(403);
            return;
        }

        const result = await db.collection("employee")
            .deleteOne({ _id: new ObjectId(id) });

        res.sendStatus(200);
    })
    return api;
}