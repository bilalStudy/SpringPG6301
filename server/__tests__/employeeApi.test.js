import request from "supertest";
import { EmployeeApi} from "../api/employeeApi.js";
import { configureExpress } from "../testUtil.js";
import { ManagerApi} from "../api/managerApi.js";
import dotenv from "dotenv";
import {MongoClient} from "mongodb";
import express from "express";
import bodyParser from "body-parser";
import res from "express/lib/response.js";
import {ActivityApi} from "../api/activityApi.js";
import {ActivityLoggerApi} from "../api/activityLoggerApi.js";

const app = express();
app.use(bodyParser.json())

let mongoClient;

const employees = [
    {
        fullname: "employee1",
        username: "test1",
        password: "employee1",
        department: "department1",
    },
    {
        fullname: "employee2",
        username: "test2",
        password: "employee2",
        department: "department2",
    },
];

const testEmployee = {
    fullname: "Test",
    username: "Test",
    password: "test",
    department: "TestDepartment",
};


let testEmployeeId = null;
let testManagerId = null;


beforeAll(async () => {
    dotenv.config();
    mongoClient = new MongoClient(process.env.MONGODB_URL);
    await mongoClient.connect();

    const database = mongoClient.db("unit_tests");
    await database.collection("employee").deleteMany({});
    app.use("/api/employees", EmployeeApi(database));
    app.use("/api/managers", ManagerApi(database));
    app.use("/api/activities", ActivityApi(database));
    app.use("/api/activitylogs", ActivityLoggerApi(database));

    const employee = await database.collection("employee").insertOne(testEmployee);


    testEmployeeId = employee.insertedId.toString();
});


afterAll(() => {
    if (mongoClient) {
        mongoClient.close();
    }
});

describe("EmployeeApi", () => {
    it("Register", async () => {
        const employee = employees[0];

        await request(app)
            .post("/api/employees/register")
            .send(employee)
            .expect(200);
    }, 5000);

    it("LoggedIn", async () => {
        await request(app).get("/api/employees/logged-in").expect(403);
    }, 5000);

    it("LoogedIn with cookie", async () => {
        await request(app)
            .get("/api/employees/logged-in")
            .set("Cookie", `employee=${testEmployeeId}`)
            .expect(200);
    }, 5000);

    it("LoggedIn with wrong cookie", async () => {
        await request(app)
            .get("/api/employees/logged-in")
            .set("Cookie", `employee=637b56944d00754a3bbd1201`)
            .expect(404);
    }, 5000);

    it("Register Duplicate account", async () => {
        const employee = employees[1];

        await request(app)
            .post("/api/employees/register")
            .send(employee)
            .expect(200);

        await request(app)
            .post("/api/employees/register")
            .send(employee)
            .expect(500);
    }, 5000);

    it("Login", async () => {
        const employee = employees[0];

        await request(app)
            .post("/api/employees/login")
            .send({
                username: employee.username,
                password: employee.password,
            })
            .expect(200);
    }, 5000);

    it("Login Wrong Credentials Fail", async () => {
        await request(app)
            .post("/api/employees/login")
            .send({
                username: "NotExisting",
                password: "NotExisting",
            })
            .expect(404);
    }, 5000);
});