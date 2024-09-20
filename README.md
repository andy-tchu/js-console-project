# Storage Application

This project is a simple command-line-based storage management application. It allows users to manage tools, materials, and users. The project is built using Node.js, MongoDB, and Mongoose, showcasing features like class inheritance, CRUD operations, and the `populate()` function in Mongoose.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [MongoDB Database Structure](#mongodb-database-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Database Setup](#database-setup)
  - [Running the Application](#running-the-application)
- [Usage](#usage)
  - [Available Commands](#available-commands)
  - [Example Scenarios](#example-scenarios)
- [License](#license)

## Features

- **Add and Manage Tools, Materials, and Users**: Add new tools, materials, and users into the system.
- **Track Item Usage**: Users can borrow tools and use materials, with usage being tracked.
- **Item Condition**: Tools have a condition value that decreases with use and can be repaired.
- **Build Functionality**: Users can use a combination of tools and materials to "build something."
- **Advanced Mongoose Features**: Class inheritance using discriminators and `populate()` for referencing related documents.

## Project Structure

```
.
├── db.js              # MongoDB connection configuration
├── item.js            # Base class for all items (tools, materials)
├── tool.js            # Tool schema and methods
├── material.js        # Material schema and methods
├── user.js            # User schema and methods
├── main.js            # Main application logic
├── .env               # Environment variables (e.g., MongoDB connection string)
└── README.md          # Project documentation
```

## MongoDB Database Structure

### Collections

- **items**: Contains both tools and materials. Tools are differentiated using the `discriminator` pattern.
- **users**: Contains user information such as name, age, and the tools they have borrowed.

### Schema Definitions

1. **Item (Base Schema)**:
   - `name` (String, required, unique)
   - `amount` (Number, required)
   - `cost` (Number, required)

2. **Tool (Inherits from Item)**:
   - `usage` (String, required)
   - `condition` (Number, required, min: 1, max: 100)
   - `borrowedBy` (Array of User references)

3. **Material (Inherits from Item)**:
   - `supplier` (String, required)
   - `quality` (String, required)

4. **User**:
   - `name` (String, required, unique)
   - `age` (Number, required)
   - `usedItems` (Virtual field for referencing tools a user has used)

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or above)
- [MongoDB](https://www.mongodb.com/) (v4.4 or above)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/storage-application.git
   cd storage-application
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

### Database Setup

1. Create a `.env` file in the project root and add your MongoDB connection string:

   ```bash
   DB_CONN=mongodb://localhost:27017/storageApp
   ```

2. Start your MongoDB server if it's not already running:

   ```bash
   mongod
   ```

### Running the Application

To start the application, run:

```bash
node main.js
```

You'll be presented with a command-line menu to perform various actions, such as adding tools, materials, users, and more.

## Usage

### Available Commands

Once the application is running, you'll see a menu of options. Here's a list of the available commands:

```
1. Add Tool
2. Add Material
3. Add User
4. Add Item Amount
5. List Items
6. List Users
7. Use Tool
8. Use Material
9. Delete Tool
10. Delete Material
11. Delete User
12. Build Something
13. Exit
```

### Example Scenarios

#### 1. Adding a New Tool

```bash
Choose an option: 1
Tool name: Hammer
Tool amount: 10
Tool cost: 15.99
Tool usage: Construction
Tool condition (1-100): 100
```

This will add a hammer to the tool inventory with 10 units, each costing $15.99, and set its condition to 100.

#### 2. Adding a New Material

```bash
Choose an option: 2
Material name: Nails
Material amount: 200
Material cost: 0.10
Supplier: Hardware Store
Quality: High
```

This will add nails to the material inventory with 200 units, each costing $0.10, supplied by "Hardware Store."

#### 3. Using a Tool

```bash
Choose an option: 7
Enter User name: John Doe
Enter Tool name: Hammer
```

If the user exists and the tool is available in good condition, it will be marked as used by the user, and the tool's condition will decrease.

#### 4. Building Something

```bash
Choose an option: 12
Enter User Name: John Doe
```

You can define a build plan within the code and the system will automatically use the required tools and materials for the user.

#### 5. Listing Items

```bash
Choose an option: 5
```

This will list all tools and materials available in the system, along with details such as condition, amount, and borrowed users (for tools).

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
