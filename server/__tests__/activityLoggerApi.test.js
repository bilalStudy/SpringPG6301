import request from "supertest";
import { EmployeeApi} from "../api/employeeApi.js";
import { configureExpress } from "../testUtil.js";
import { ManagerApi} from "../api/managerApi.js";
import dotenv from "dotenv";
import {MongoClient} from "mongodb";
import express from "express";
import bodyParser from "body-parser";
import res from "express/lib/response.js";
import {ActivityLoggerApi} from "../api/activityLoggerApi.js";
import {ActivityApi} from "../api/activityApi.js";

const app = express();
app.use(bodyParser.json())

let mongoClient;
const testEmployee = {
    username: "Test",
    fullname: "Test",
    password: "Test",
    department: "TestDepartment"
};

const testManager = {
    username: "Test",
    fullname: "Test",
    password: "Test",
};

let testEmployeeId = null;
let testManagerId = null;


beforeAll(async () => {
    dotenv.config();
    mongoClient = new MongoClient(process.env.MONGODB_URL);
    await mongoClient.connect();

    const database = mongoClient.db("unit_tests");
    app.use("/api/employees", EmployeeApi(database));
    app.use("/api/managers", ManagerApi(database));
    app.use("/api/activities", ActivityApi(database));
    app.use("/api/activitylogs", ActivityLoggerApi(database));
    await database.collection("employee").deleteMany({});

    const employee = await database.collection("employee").insertOne(testEmployee);

    testEmployeeId = employee.insertedId.toString().trim();

    await database.collection("manager").deleteMany({});

    const manager = await database.collection("manager").insertOne(testManager);

    testManagerId = manager.insertedId.toString();

    Object.defineProperty(window.document, 'cookie', {
        writable: true,
        value: 'manager=omnomnom',
    });


});


afterAll(() => {
    if (mongoClient) {
        mongoClient.close();
    }
});

describe("ActivityLoggerApi", () => {
    it("Fetch Log", async () => {
        const agent = request.agent(app);
        const response = await agent.get("/api/activitylogs");

        expect(response.status).toEqual(200)


    }, 5000);

    it("Update log", async () => {
        await request(app).put("/api/activitylogs").send({}).expect(403);
    }, 5000);

    it("Update log with cookie", async () => {
        await request(app)
            .put("/api/activitylogs")
            .set("Cookie", `employee=${testEmployeeId}`)
            .send({})
            .expect(200);
    }, 5000);

    it("Insert log", async () => {
        await request(app).post("/api/activitylogs").send({}).expect(403);
    }, 5000);

    it("Insert log with cookie", async () => {
        await request(app)
            .post("/api/activitylogs")
            .set("Cookie", `employee=${testEmployeeId}`)
            .send({})
            .expect(200);
    }, 5000);

    it("Delete log", async () => {
        await request(app).delete("/api/activitylogs").send({ id: "238383" }).expect(403);
    }, 5000);

    it("Delete log without id", async () => {
        await request(app).delete("/api/activitylogs").send({}).expect(404);
    }, 5000);
});