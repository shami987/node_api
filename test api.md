1. LOGIN (SAVE TOKEN)                      
{{baseUrl}}/api/auth/login
{
  "email": "test@gmail.com",
  "password": "123456"
}

2. GET PROFILE (Protected)
GET
{{baseUrl}}/api/auth/me

✅ Expected response

{
  "_id": "65abc123...",
  "name": "Test User",
  "email": "test@gmail.com"
}

3. CHANGE PASSWORD (Logged in)

PUT
{{baseUrl}}/api/auth/change-password

Body
{
  "oldPassword": "123456",
  "newPassword": "newpass123"
}

Response

{
  "message": "Password changed successfully"
}

4. FORGOT PASSWORD

POST
{{baseUrl}}/api/auth/forgot-password

Body
{
  "email": "test@gmail.com"
}

✅ Response

{
  "message": "Reset link sent"
}

📌 Check server console

Reset password: http://localhost:3000/api/auth/reset-password/ABC123TOKEN

🚪 6. LOGOUT

POST
{{baseUrl}}/api/auth/logout


✅ Response

{
  "message": "Logged out successfully"
}

7. CREATE CATEGORY (POST)

POST

http://localhost:3000/api/categories

Body → raw → JSON
{
  "name": "Electronics",
  "description": "Electronic devices and accessories"
}

8. GET ALL CATEGORIES (READ)
Endpoint

GET

http://localhost:3000/api/categories

9.GET CATEGORY BY ID (READ ONE)
Endpoint

GET

http://localhost:3000/api/categories/65a9c0b9c1e2f9b9c6a1b234

10. UPDATE CATEGORY (PUT)
Endpoint

PUT

http://localhost:3000/api/categories/65a9c0b9c1e2f9b9c6a1b234

Body → raw → JSON
{
  "name": "Updated Electronics",
  "description": "Updated description"
}

11.DELETE CATEGORY
Endpoint

DELETE

http://localhost:3000/api/categories/65a9c0b9c1e2f9b9c6a1b234

12. CREATE PRODUCT (POST)
POST
http://localhost:3000/api/products

Body → raw → JSON
{
  "name": "HP Laptop",
  "price": 1200,
  "description": "Core i7 16GB RAM",
  "categoryId": "65ab12f7c9b11e34d9910001",
  "inStock": true,
  "quantity": 10
}

13. GET ALL PRODUCTS (with category populated)
GET
http://localhost:3000/api/products

14. GET PRODUCT BY ID
GET
http://localhost:3000/api/products/65ab141fc9b11e34d9910002

15. UPDATE PRODUCT (PUT)
PUT
http://localhost:3000/api/products/65ab141fc9b11e34d9910002

Body
{
  "name": "HP Laptop Pro",
  "price": 1400,
  "description": "Core i9 32GB RAM",
  "categoryId": "65ab12f7c9b11e34d9910001",
  "inStock": true,
  "quantity": 5
}

16. DELETE PRODUCT
DELETE
http://localhost:3000/api/products/65ab141fc9b11e34d9910002