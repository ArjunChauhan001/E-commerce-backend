# E-commerce Platform

## Description
A RESTful API for an e-commerce platform with JWT-based authentication, role-based access control, inventory management, and order processing. Built using Node.js, Express, and MongoDB.

## Features
- **Authentication**: 
  - JWT-based authentication for secure user sessions.
  - Role-based access control for customers and admins.
- **Inventory Management**:
  - CRUD operations for products.
  - Stock level management with low-stock alerts.
- **Order Management**:
  - Customers can place orders and view their order status.
  - Admins can manage order statuses and view all orders.

## Prerequisites
- Node.js
- MongoDB
- Postman (optional, for testing API endpoints)

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/ArjunChauhan001/E-commerce-backend.git

##.env 
-PORT=5000
-MONGO_URI=mongodb+srv://arjunchauhan2755:EnjLYvIr5hE0fQwH@ecommerce.5qiwb.mongodb.net/ecommerce-backend
-MONGO_PASS=EnjLYvIr5hE0fQwH
-JWT_SECRET=hard_to_decode
-JWT_EXPIRE=7d
