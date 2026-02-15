const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payment");
const courseRoutes = require("./routes/Course");
const contactUsRoutes = require("./routes/ContactUs");

const database = require("./configs/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./configs/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 4000;

//database connect
database.connect();

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5731",
    credentials: true,
  }),
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  }),
);

//coudinary connect
cloudinaryConnect();

// //api mounte
app.use("/app/v1/auth", userRoutes);
app.use("/app/v1/profile", profileRoutes);
app.use("/app/v1/course", courseRoutes);
app.use("/app/v1/payment", paymentRoutes);
app.use("/app/v1/contact", contactUsRoutes);

//def route

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your servevr is up and running....",
  });
});

app.listen(PORT, () => {
  console.log(`App is listening at ${PORT}`);
});
