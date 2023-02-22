import {MongoClient, ObjectId} from "mongodb";
import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import path from "path";
import {EmployeeApi} from "./api/employeeApi.js";
import {ManagerApi} from "./api/managerApi.js";
import {ActivityApi} from "./api/activityApi.js";
import {ActivityLoggerApi} from "./api/activityLoggerApi.js";
import {WebSocketServer} from "ws";

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static("../client/dist"));

const mongodburl = process.env.MONGODB_URL;

if(mongodburl){
    const client = new MongoClient(mongodburl);

    const mongoDbName = process.env.MONGODB_DATABASE || "SpringPgExam";

    client.connect().then(async (conn) => {
        app.use("/api/employees", EmployeeApi(conn.db(mongoDbName)));
        app.use("/api/managers", ManagerApi(conn.db(mongoDbName)));
        app.use("/api/activities", ActivityApi(conn.db(mongoDbName)));
        app.use("/api/activitylogs", ActivityLoggerApi(conn.db(mongoDbName)));
    })
}


const sockets = [];

const wsServer = new WebSocketServer({noServer: true})

wsServer.on("connection", (socket) => {
    sockets.push(socket);
    socket.on("message", (message) => {
        console.log("There's a message" + message)
        for (const reciepient of sockets) {
            reciepient.send(message.toString());
        }
    })
});


app.use((req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/api")) {
        return res.sendFile(path.resolve("../client/dist/index.html"));
    } else {
        next();
    }
});

const server = app.listen(process.env.PORT || 3000,
    () => {
        console.log(`express server started on: http://localhost:${server.address().port}`)

        server.on("upgrade", (req, socket, head) => {
            wsServer.handleUpgrade(req, socket, head, (socket) => {
                console.log("connected");
                wsServer.emit("connection", socket, req)
            })
        })
    });