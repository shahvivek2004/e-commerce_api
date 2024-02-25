# Your Project Name
E-commerce API

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)

## Introduction

Welcome to E-commerce API – a robust and flexible API-driven e-commerce platform designed to streamline the shopping experience for users. Whether you are a developer looking to integrate powerful e-commerce features into your application or a business owner aiming to establish an online presence, our project provides a comprehensive solution.es.

## Key Features

- **Category Listing:** Explore a variety of product categories to discover a diverse range of items.
- **Product Listing:** Retrieve detailed product information based on category, including title, price, description, and availability.
- **Product Details:** Access in-depth details about specific products using their unique identifiers.
- **Cart Management:** Seamlessly manage your shopping cart, adding, updating, and removing items as needed.
- **Order Placement:** Effortlessly place orders with selected products from your cart.
- **Order History:** Keep track of your purchase history with an overview of past orders.
- **User Authentication:** Securely register and log in to access personalized features.
- **User Management:** Manage user profiles and account settings efficiently.


## Getting Started

### Prerequisites

prerequisites or dependencies that users need to have installed.

- Node.js
- npm/yarn
- Database (e.g., PostgreSQL)


### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/your-repository.git
   ```
   
2. Install dependencies:

   ```bash
   cd your-repository
   npm init
   npm install
   ```

### Usage

type below command in terminal:

```bash
nodemon index.js
```

go to any rest client for e.g: postman and you can
implement any api endpoints with prefix:

```bash
http://localhost:3000
```


   
## API Endpoints: 
**GET /categories:** Retrieve a list of categories.
**GET /products/:categoryId:** Retrieve products based on category ID.
**GET /products/:productid:** Retrieve products based on product ID.
**POST /cart/add:** Add a product to the user's cart.
**GET /cart/:userid:** View the contents of the user's cart.
**PUT /cart/update:** Update the quantity of a product in the user's cart.
**DELETE /cart/remove:** Remove a product from the user's cart.
**POST /order/place:** place an order
**GET /order/history:** get order history
**GET /order/details:** get order details
**POST /users/register:** Register a new user.
**POST /users/login:** Log in and obtain an authentication token.


## Authentication

### Overview

User authentication in this project is implemented using JSON Web Tokens (JWT). JWTs provide a secure and efficient way to authenticate users and authorize access to protected resources.

### How It Works

1. **User Registration:**
   - Users can register by providing a unique username, a secure password, and a valid email address.

2. **User Login:**
   - To authenticate, users send a POST request to the `/login` endpoint with their username and password.
   - Upon successful authentication, the server generates a JWT containing a user identifier and other relevant information.

3. **Token Generation:**
   - The server signs the JWT with a secret key to ensure its integrity.
   - The generated token is sent back to the client in the response.

4. **Token Usage:**
   - Subsequent API requests that require authentication should include the JWT in the `Authorization` header using the "Bearer" scheme.
   - Example: `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjExLCJpYXQiOjE2NTU1MTQ2MTMsImV4cCI6MTY1NTUyMDIxM30.z-C5XXVeBt8LvsOV5DG9KQPIuNt2RH-YolD1eJXbfHI`

### Making Authenticated Requests

To make authenticated requests to protected API endpoints, follow these steps:

1. **Obtain a Token:**
   - Register or log in to get a JWT.
   - Store the token securely on the client side.

2. **Include Token in Requests:**
   - Include the token in the `Authorization` header of API requests using the "Bearer" scheme.
   - Example using cURL:
     ```bash
     curl -X GET \
       -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjExLCJpYXQiOjE2NTU1MTQ2MTMsImV4cCI6MTY1NTUyMDIxM30.z-C5XXVeBt8LvsOV5DG9KQPIuNt2RH-YolD1eJXbfHI" \
       https://api.example.com/protected-endpoint
     ```

3. **Handling Token Expiry:**
   - Tokens have an expiration time (`exp` claim). If a request fails due to an expired token, obtain a new token by re-authenticating.

### Token Security

- **Keep Tokens Secure:**
  - Treat tokens like passwords; store and transmit them securely.
  
- **Use HTTPS:**
  - Always make API requests over HTTPS to encrypt the communication between the client and server.

### Example Code

```javascript
// Example code to include token in API request using Fetch
const apiUrl = 'https://api.example.com/protected-endpoint';
const token = 'your-token-here';

fetch(apiUrl, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```


## License

This project is licensed under the [MIT License]

### MIT License
MIT License

Copyright (c) 2021 Othneil Drew

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


