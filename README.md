# ft_transcendence

The final project of the 42 cursus.

ft_transcendence is an interactive, single page and fully responsive web application where you can play pong with players. have a chat with friends and make communities, costumize your profile.
the game also has a match-making system, normal and ranked modes, with a spectating option.<br/>


https://github.com/P3enguin/42_transcendence/assets/94067494/16d95d2f-aa25-44df-bba2-d7c0ca6c6b22


## Technologies :
- Front-end : Next Js.
- Back-end  : Nest Js.
- Database  : Postgresql.
- ORM       : PRISMA.
- Styling   : Tailwind CSS.

## How to use :
### Prerequisite :
- Package manager (npm or yarn).
- Docker.
- If you are using ```Windows```, I highly recommend running the website on a linux environmnet, use [WSL](https://learn.microsoft.com/en-us/windows/wsl/install) .
### Environment :
You need to setup all the environment variables in the project, There is a `env.template`, copy Its content in a new `.env` file and fill the variables.
### AUTHENTICATION:
Authentication is based upon oauth2.<br />
We implemented two methods, ```42``` and ```Google login```. if you are not a 42 student, use the google API to access the app. In both cases you need to create a new API application so you can get the ```PUBLIC``` and ```PRIVATE``` keys necessary for the environment.
### Running the app:
You can either run the whole application from docker, using the command ```docker-compose up```, It will build and run the app.<br/>
Or, you can do it manually. here are the steps (if you are using npm):
- Use Docker **Only** to run the database : ```docker-compose up database```.
- Inside both client and server folders, run ```npm install```, this will install all the dependencies for the project.
- In the client folder, ```npm run dev``` to run the frontend of the website.
- In the server folder, First run ```prisma migrate dev``` and ```prisma generate```. ```npm run start:dev``` to run the server side of the website.
  
