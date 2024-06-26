# job-portal-app

<a name="readme-top"></a>
<br />

<!-- TABLE OF CONTENTS -->
## 🚩 Table of Contents

- [Getting Started & Setup](#-getting-started-&-setup)
  - [Prerequisites](#-prerequisites)  
  - [Installation](#-installation)  
- [Scripts](#-scripts)  
- [Routes](#-routes)  
- [Additional Information](#-additional-information)  <br />
<br />



<!-- ABOUT THE PROJECT -->
## 🔧 Getting Started & Setup 

This section provides step-by-step instructions on how to set up the backend service locally for development and testing purposes. Follow these guidelines to get your environment ready for implementing all the Functional and non-functional requirements. The Project uses Typescript language using NodeJS Framework. For Database purposes, we are using Postgres SQL under Docker container.

### Prerequisites

For package manager, npm is used in the project, so it is required that you must have npm on your system.
* npm
  ```sh
  ~ npm install npm@latest -g
  ```
* Docker daemon installation
  Go through this website, download the docker daemon that accommodates your system, and follow the steps.
  <br />
  [Docker Download Link](https://www.docker.com/products/docker-desktop/) 

### Installation
1. Clone the repo
   ```sh
   ~ git clone https://github.com/your_username_/Project-Name.git
   ```
2. Install NPM packages
   ```sh
   ~ npm install
   ```
3. Setting up the Postgres database on Docker container
    * ***Go thru this link*** : [*Quickly set up a local Postgres database using docker*](https://medium.com/@jewelski/quickly-set-up-a-local-postgres-database-using-docker-5098052a4726)
      <h3>OR</h3> 
    **Follow the steps below:** 
    * **Reconfigure docker-compose** : Once you clone the code, with predefined username, password and database, which can be changed. Note, the volume for db data mounting needs to be changed.
       ```sh
         volumes:
          - */Path-to-data-store*:/var/lib/postgresql/data
          - ./src/db/migrations/sql:/docker-entrypoint-initdb.d
       ```
          > Note: The path within the asterisk needs to be changed to a location in the host machine. 

    * **DB Migration Service** : A database migration file *1_create_table.sql* is already available, which will set up the database tables and handle the DB relations once your use the build and run commands:
       ```sh
        ~ npm run build
        ~ npm run dev
       ```       
    * **Container initialization** : Use the command: ```docker compose up -d --build``` to start a new container. 
    * **Spin up the database** : Use the command: ```docker exec -it <container_id> bash``` to start a new container terminal.
      Use command ```psql -U <root_user_name> -d <db_name>``` to root login. And voila! You are inside the docker psql terminal.
<br /> 

4. Setup the environment variables file.
   * Create a .env file in the root directory for storing the configuration setting and environment variables.
     <br />
     
   ```js
    PORT=<PORT_NUMBER>
    DB_HOST=localhost
    DB_USER=<root_user_name>
    DATABASE=<db_name>
    DB_PASSWORD=<db_password>
    DB_PORT=5432
    DB_POOL_SIZE=2
    DB_POOL_CLIENT_IDLE_TIMEOUT=10000
    DB_POOL_CLIENT_CONNECTION_TIMEOUT=2000
    JWT_SECRET=<secret_key>
   ```
   > Note: I am using the PORT 3000 for listening to the requests, any other port can also be used. 
<br/>

 7. Populating the Database using dump files.
    * Now that our project set up is complete and we have established a connection with Postgres, now we will use some sample data scripts to populate the database using dumpfiles.
    > Note: Go through the [g-drive link](https://drive.google.com/drive/folders/1hFqoYb4QuEDJwXoP3qe-hyyvyItEn-jr?usp=sharing) to get the dump files.
    <br />    
<br />


<!-- TABLE OF CONTENTS -->
## 📝 Scripts

| Script | Description |
| --- | --- |
| `~npm run build`   | Build command: this command will transpile the TS code and create and update the build folder by the name of ***/dist***  |
| `~npm run dev`   | Runs the application in development mode with nodemon, watching for changes in TypeScript files and restarting automatically. |
| `~npm run start`   | Runs the main application using ts-node |
<br />


<!-- TABLE OF CONTENTS -->
## 📍 Routes 
<p> Having completed the project setup, you now possess the entire updated codebase. You can proceed by running the application and thoroughly testing the available routes</p>
Before starting up with the routes, just make sure to run the commands below.

```sh
~npm run build
~npm run dev
```
<br /> 

| Routes | What it does |
| --- | --- |
| *Recruiter Sign-up(register)* <br /> `/recruiter/register` | ***POST REQUEST***: Creating a new recruiter entity which can post multiple jobs for candidates and view all the jobs applications. <br/> Note : data input as json has to be passed <br /> ```{"email": "Jim@gmail.com","pwd": "secret","recName": "Jim","recDept": "Marketing"}```<br /> `email` and `password` are mandatory for sign-up. |
| *Candidate Sign-up(register)* <br /> `/candidate/register` | ***POST REQUEST***: Creating a new candidate user which can login, apply to multiple jobs, and search for jobs.  <br/> Note : data input as json has to be passed <br /> ```{"userName": "Hritik","userDept": "Engineering","age": 24,"email": "student@gmail.com","pwd":"secret","userStatus":"Active"}```<br /> `email` and `password` are mandatory for sign-up. |
| *Recruiter Sign-in* <br /> `/recruiter/login` | ***POST REQUEST***: Login request<br/> Note : data input as json has to be passed <br /> ```{"email": "Jim@gmail.com","pwd": "secret"}```<br />|
| *Candidate Sign-in* <br /> `/candidate/login` | ***POST REQUEST***: Login request<br/> Note : data input as json has to be passed <br /> ```{"email":"student@gmail.com","password":"secret"}```<br />|
| *Pulish a new Job* <br /> `/recruiter/newJob/:recId` | ***POST REQUEST***: Publishing a new job with all the appropriate information. <br /> ```{"dept": "Sales Head","jobDesc": "Need digital Sales specialist","salaryRange": "20k - 30k"}```<br /> | 
| *View Job Application Logs* <br /> `/recruiter/applicationLogs/:jobId` | ***GET REQUEST***: Viewing the information of all the candidates who applied for the job. |
| *Candidate Search Jobs* <br /> `/candidate/searchJobs` | ***GET REQUEST***: Candidates can go through all the jobs and even search for the jobs on the basis of *dept*: department name or *jobDesc*: job description. |
| *Apply to jobs* <br /> `/candidate/apply/:jobId` | ***POST REQUEST***: Candidates can apply to multiple number of jobs. *Note: Each candidate can only apply to a job once.* |
<br />

> *Note: Be careful while updating json input,user data and params, all of these are allocated with Zod validation.*


<!-- TABLE OF CONTENTS -->
## 📄 Additional Information
1. For any information about endpoints, CI/CD or design decision I made, you can go through this [**Video Explanation**](https://www.loom.com/share/d7458610a5b74c46846c58202c07e4fa?sid=ebf12543-029f-4637-befc-1a9e595e8096) where I have given a brief about the code base.



<p align="right">(<a href="#readme-top">back to top</a>)</p>
