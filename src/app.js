const express = require("express");
const cors = require("cors");
const sequelize = require("./sequelize");
require("./models");
const routes = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "API is running..."});
});

app.use("/api", routes);

const PORT = process.env.PORT || 3000;

(async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connection established");

        await sequelize.sync();
        console.log("Model synchronised");

        app.listen(PORT, () => {
            console.log(`Server running on PORT ${PORT}`);
        });
    } catch (err) {
        console.error("Unable to start server", err);
    }
})();

module.exports = app;