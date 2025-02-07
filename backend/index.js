const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectdb = require("./db/dbConnection")

dotenv.config();

const app = express();
connectdb();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {


    res.send("hello world")

})

const PORT = 3000;


server.listen(PORT, () => console.log(`Server running on port ${PORT}`));