# Swissmote Event Management App

A full-stack event management application designed to help manage events, registrations, and user authentication. The app is built with a modern tech stack including Express, Prisma (with MongoDB), and React (using Vite) and features secure authentication, image uploads via Cloudinary, and robust error handling.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Client Setup](#client-setup)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication:** Secure registration, login, token refresh, and logout with JWT (access & refresh tokens) and cookies.
- **Event Management:** Create and manage events.
- **Image Uploads:** Upload images to Cloudinary and store secure URLs and public IDs in the database.
- **Validation & Error Handling:** Robust input validation using `express-validator` and comprehensive error extraction on both backend and frontend.
- **Responsive Frontend:** A React-based client built with Vite, Tailwind CSS, React Router, and more.

## Tech Stack

- **Backend:** Node.js, Express, Prisma, MongoDB Atlas, Cloudinary
- **Frontend:** React, Vite, Tailwind CSS, React Router, React Toastify
- **Authentication:** JWT, Refresh Tokens, Cookie Parser
- **Utilities:** express-validator, bcryptjs, dotenv, Morgan

## Prerequisites

- **Node.js:** v14 or higher
- **npm** or **yarn**
- **MongoDB Atlas:** (or a local MongoDB installation)
- **Cloudinary Account:** for image uploads
- **Environment Variables:** stored in a `.env` file

## Installation

### Clone the Repository

```bash
git clone https://github.com/yourusername/swissmote-event-management-app.git
cd swissmote-event-management-app
```

### Back end

From root folder

```bash
npm install
```

### Front end

```bash
cd client
npm install
```

## Configuration

Create a .env file in the root directorey with

```bash
PORT = 3000
DATABASE_URL = "MONGODB URL"

PW_HASH = 10

ACCESS_TOKEN_SECRET= String
REFRESH_TOKEN_SECRET= String

NODE_ENV = development | production

CLOUDINARY_CLOUD_NAME=String
CLOUDINARY_API_KEY=String
CLOUDINARY_API_SECRET=String
```

## Running the Application

### Starting the backend

From the root folder

```bash
npm run dev
```

### Starting the Front end React

```bash
cd client
npm run dev
```

## API End points

### Authentication

- **Register:** POST /api/auth/register
- **Login:** POST /api/auth/login
- **Check Authentication:** GET /api/auth/check-auth
- **Refresh access token:** POST /api/auth/refresh
- **Logout:** POST /api/auth/logout

### Category

- **All Categories:** GET /api/category
- **Add Category:** POST /api/category
- **Delete Category:** DELETE /api/category/:categoryid

### Events

- **Get All Events:** GET /api/event
- **Add Event:** POST /api/event
- **Attend Event:** POST /api/event/:eventId/attend

### My Events

- **Get events created by logged in user:** GET /api/myevent
- **Delete event:** DELETE /api/myevent/:eventId

## Profile

- **Get Profile:** GET /api/profile
