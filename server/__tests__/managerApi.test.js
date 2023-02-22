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
    await database.collection("manager").deleteMany({});

    const manager = await database.collection("manager").insertOne(testManager);


    testManagerId = manager.insertedId.toString();
});


afterAll(() => {
    if (mongoClient) {
        mongoClient.close();
    }
});

describe("ManagerApi", () => {
    it("Login", async () => {
        await request(app).post("/api/managers/login").expect(404);
    }, 5000);

    it("Login with credentials", async () => {
        await request(app).post("/api/managers/login").send(testManager).expect(200);
    }, 5000);

    it("Login with empty credentials", async () => {
        await request(app)
            .post("/api/managers/login")
            .send({ username: "", password: "" })
            .expect(404);
    }, 5000);

    it("GetSignedOnManagerWithoutCookies", async () => {
        await request(app).get("/api/managers/logged-in").expect(403);
    }, 5000);

    it("GetSignedOnManager", async () => {
        await request(app)
            .get("/api/managers/logged-in")
            .set("Cookie", `manager=${testManagerId}`)
            .expect(200);
    }, 10000);
});