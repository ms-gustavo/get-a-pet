const express = require("express");
const cors = require("cors");

const app = express();

// Config JSON Response
app.use(express.json());

// Solve CORS - Evita erros ao acessar API do mesmo dominio - localhost
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

// Public folders for images
app.use(express.static("public"));

// Routes
const UserRoutes = require("./routes/UserRoutes");
const PetRoutes = require("./routes/PetRoutes");
app.use("/users", UserRoutes);
app.use("/pets", PetRoutes);
// Port
app.listen(5000);
