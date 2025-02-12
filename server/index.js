import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectToDb from "./src/config/databaseConfig.js";
import authRoute from "./src/routes/authRoute.js";
import patientRoute from "./src/routes/patientRoute.js";
import doctorRoute from "./src/routes/doctorRoute.js";
import adviceRoute from "./src/routes/adviseRoute.js";
import healthDataRoute from "./src/routes/healthDataRoute.js";
// import appointmentRoute from "./src/routes/appointmentRoute.js";
import { PORT, FRONTEND_URL } from "./src/config/serverConfig.js";

const app = express();

try {
    await connectToDb();
    console.log("Database connected successfully");
} catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1); // Exit the process with failure
}

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    cors({
        origin: [FRONTEND_URL, "https://htm-nu.vercel.app", "https://post-medi-care.vercel.app"],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Routes
app.use(`/api/v1/auth`, authRoute);
app.use(`/api/v1/patient`, patientRoute);
app.use(`/api/v1/doctor`, doctorRoute);
app.use(`/api/v1/advice`, adviceRoute);
// app.use(`/api/v1/appointment`, appointmentRoute);
app.use(`/api/v1/health-data`, healthDataRoute);

app.listen(PORT, () => {
    console.log("Server is running on PORT:", PORT);
});