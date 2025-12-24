# Product Management App

A React application for managing a product catalog with features like sorting, editing, and commenting. Built as a technical assignment.

## 🚀 Features
- **Product List**: View all products with images and stock counts.
- **Sorting**: Sort products by Name (A-Z) or Quantity.
- **CRUD Operations**: Add, Edit, and Delete products using a unified Modal system.
- **Product Details**: Dedicated page for each item showing weight, size, and full info.
- **Comments System**: Add and delete comments for specific products.
- **Responsive UI**: Clean, light-themed interface.

## 🛠 Tech Stack
- **Frontend**: React (Vite), TypeScript.
- **State Management**: Redux Toolkit (RTK).
- **Routing**: React Router v6.
- **Backend Simulation**: JSON Server (REST API).

## 📋 Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

## ⚙️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <your-repo-link>
   cd <your-repo-name>
Install dependencies:

Bash

npm install
Start the Backend (JSON Server): In a separate terminal window, run:

Bash

npx json-server --watch db.json --port 3001
Start the Frontend:

Bash

npm run dev
Open the app: Navigate to http://localhost:5173 (or the port shown in your terminal).

📂 Project Structure
src/store: Redux slices and store configuration.

src/components: Reusable UI components (Modal, etc.).

src/types: TypeScript interfaces.

db.json: Local database file.
