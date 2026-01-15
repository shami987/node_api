import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-Commerce API",
      version: "1.0.0",
      description: "API documentation for Products, Categories, Auth & Cart",
      contact: {
        name: "Cephas",
        email: "shamicephas9@gmail.com"
      },
      license: {
        name: "MIT"
      }
    },
    servers: [
      { url: "http://localhost:3000", description: "Local server" }
    ],
    tags: [
      { name: "Auth", description: "Authentication & user management" },
      { name: "Categories", description: "Category management" },
      { name: "Products", description: "Product management" },
      { name: "Cart", description: "Shopping cart operations" }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            email: { type: "string" }
          }
        },

        Category: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            description: { type: "string" }
          }
        },

        Product: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            price: { type: "number" },
            description: { type: "string" },
            category: { $ref: "#/components/schemas/Category" },
            inStock: { type: "boolean" },
            quantity: { type: "number" }
          }
        },

        CartItem: {
          type: "object",
          properties: {
            product: { $ref: "#/components/schemas/Product" },
            quantity: { type: "number" },
            subtotal: { type: "number" }
          }
        },

        Cart: {
          type: "object",
          properties: {
            _id: { type: "string" },
            user: { $ref: "#/components/schemas/User" },
            items: {
              type: "array",
              items: { $ref: "#/components/schemas/CartItem" }
            },
            totalPrice: { type: "number" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ["./src/routes/*.ts"]
};

export default swaggerJsdoc(options);
