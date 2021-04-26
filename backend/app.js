const express = require("express");
const app = express();
const port = process.env.PORT || 9000;
const path = require('path');

const dotenv = require('dotenv')
dotenv.config();

require("./db/mongoose");

// Models
require("./models/User_Schema");
require("./models/Post_Schema");

app.use(express.json());

// Routes
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/users"));

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'build')))

    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'build', 'index.html')))
} else {
    app.get('/', (req, res) => {
        res.send('API is running..!!!')
    })
}


app.listen(port, () => {
    console.log("Server is running on port " + port);
})