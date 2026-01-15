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


// Load environment variables from .env file
dotenv.config();



const app = express();

//Middleware
app.use(express.json());
app.use(morgan("combined"));

//connect DB
connectDB();

app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/auth", authRoutes);

//swagger route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})