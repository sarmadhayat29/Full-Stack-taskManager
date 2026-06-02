# Full-Stack Task Manager

A full-stack, lightweight task manager application built with Vanilla JavaScript, Node.js, Express, and MongoDB.

## Features

- **Create Tasks:** Quickly add new tasks to your list.
- **View Tasks:** See all your tasks in a clean interface.
- **Delete Tasks:** Remove tasks once they are completed.
- **Persistent Storage:** All tasks are securely saved locally using a MongoDB database.
- **RESTful API:** Clean backend endpoints for managing operations.

## Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose (ODM)

## Prerequisites

Before you begin, ensure you have met the following requirements:
* You have installed [Node.js](https://nodejs.org/en/) (v14.0.0 or higher recommended)
* You have installed and are running [MongoDB](https://www.mongodb.com/try/download/community) locally (typically on port 27017)


## Running the Application

1. Make sure your local MongoDB instance is running.
2. Start the Express server:
   ```bash
   node server.js
   ```
   *You should see a message in your terminal saying "Server is running on http://localhost:3000" and "Connected to MongoDB."*
3. Open your web browser and navigate to:
   ```
   http://localhost:3000
   ```
*(Note: Do not use Live Server or open the index.html file directly in your browser, as the frontend needs to communicate with the Express backend to load the database).*

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/items` | Retrieve all tasks |
| `POST` | `/api/items` | Create a new task |
| `DELETE` | `/api/items/:id` | Delete a task by ID |

