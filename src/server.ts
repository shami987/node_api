import express from "express";
import categoryRoutes from "./routes/categoryRoutes";
import productRoutes from "./routes/productRoutes";
import morgan from "morgan";
import cartRoutes from "./routes/cartRoutes";
import connectDB from "./config/db"
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";
import orderRoutes from "./routes/orderRoutes";
import adminOrderRoutes from "./routes/adminOrderRoutes";


// Load environment variables from .env file
dotenv.config();



const app = express();

//Middleware
app.use(express.json());
app.use(morgan("combined"));

//connect DB
connectDB();

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Node API",
    version: "1.0.0",
    documentation: "/api-docs",
    endpoints: {
      auth: "/api/auth",
      products: "/api/products",
      categories: "/api/categories",
      cart: "/api/cart",
      orders: "/api/orders",
      admin: "/api/admin"
    }
  });
});

app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminOrderRoutes);

//swagger route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})