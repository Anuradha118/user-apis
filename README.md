# user-apis

A simple implemetation of node apis and test cases.

# Features

1. POST API for creating a new user
2. DELETE API for deleting an existing user
3. Both the APIs should be accessible only if a valid token (random string) is present in the HTTP header.
4. One user can work on many tasks.
5. User login functionality with jwt authentication(implemented using Passport) and token should be used while accessing subsequent apis.
6. Get all users with pagination.
7. Get single user along with his all tasks.

# How to Install the Application

1. Download the code from github.
2. Unzip the folder
3. Open command prompt from the unzipped folder.
4. Setting up local server First run the local mongodb server, then add .env inside  root folder with all the environment variables like PORT, JWT_SECRET,DATABASE.
5. Run command: npm install to install all the packages
6. Run command: npm start
7. The local server will start with the mentioned port.
8. To run test cases Run command: npm test.

# Developed with:

  * MongoDB
  * NodeJS
  * ExpressJS