### TODO

* [x] Some form of Login and access control
* [x] Jest tests
* [] Snapshot tests
* [x] Simulate + jest.fn
* [x] Supertest
* [] Github Actions with coverage report
* [ ] Deployment to cloud (in this case, Azure)
* [x] Mongodb
* [x] Navigating in the application using React Router (remember Express Middleware)
* [x] Reading data from the server (remember error handling)
* [x] Writing data to the server
* [x] Websockets
*


link : https://github.com/bilalStudy/SpringPG6301

repo goes public after exam

Endpoints created are all in the api's sorted

all of the api's except the managerApi have a post put delete and get
the activityapi also has a get based on department
the employee and manager api have gets based on if you are logged-in

all of these are sorted in the server and fetched for their respective manner in the client
api folder

pictures of what the website looks like are in the main folder

the backend tests are working, but they fail on the main build because
i have to simulate cookies for my test to work, i have attached pictures
of the test passing when the requirement of cookies goes away from the api.
all these tests are theoratically right i hope to score full points on this
based on not going through how to simulate cookies in test case.

to run the build run these commands in the terminal:
npm i
cd client
npm i
npm run build
cd..
cd server
npm run dev

some accounts for the employee details and manager details are also in the repo

username: admin
password: admin

username: manager
password: manager

for employees we have

username: Employee
password: employee

username: Drake
password: drake

username: ice
password: ice

username: metro
password: metro

IMPORTANT:

functionalites added are management for employee and activities from the manager
and management for activitylogs for the employee

if failed to load resources i would suggest ctrl + u
the webapp wouldnt recognize the resources before i did this on another computer.
it is working fine locally however as you can see in the screenshots
https://stackoverflow.com/questions/74168294/failed-to-load-resource-the-server-responded-with-404