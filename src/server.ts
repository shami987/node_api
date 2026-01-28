import express from "express";
import cors from "cors";
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
import { staticUploads } from "./middlewares/staticUploads";
import userRouteres from "./routes/userRoutes";
import userRoutes from "./routes/userRoutes";


// Load environment variables from .env file
dotenv.config();



const app = express();

//Middleware
const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://new-kapee-n9jg4r730-cephas-projects-2ece8076.vercel.app" // deployed frontend
];

app.use(cors({
  origin: function(origin, callback) {
    if(!origin) return callback(null, true); // allow requests like Postman/curl
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy does not allow access from this origin';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

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
app.use("/uploads", staticUploads);
app.use("/api/users", userRoutes);

//swagger route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})