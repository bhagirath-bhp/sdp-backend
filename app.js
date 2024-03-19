const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user");
const clientRoutes = require("./routes/client");
const productRoutes = require("./routes/product")
const taskRoutes = require("./routes/task");
const orderRoutes = require("./routes/order");
const { isLoggedIn } = require('./routes/auth');


app.use(cors());

const mongoUsername = encodeURIComponent(process.env.MONGO_USER);
const mongoPassword = encodeURIComponent(process.env.MONGO_PASS);
const mongocluster = process.env.MONGO_CLUSTER;
const mongoAuthSource = process.env.MONGO_AUTH_SOURCE;
const mongoAuthMechanism = process.env.MONGO_AUTH_MECHANISM;


// let uri = `mongodb+srv://${mongoUsername}:${mongoPassword}@openchat.zvgfv36.mongodb.net/?retryWrites=true&w=majority&appName=openchat`;
// mongoose.connect(uri || 'mongodb://localhost:27017/sample-db',);
mongoose.connect('mongodb://127.0.0.1:27017/sample-db');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));


app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('/api/user', userRoutes);
app.use('/api/client', isLoggedIn, clientRoutes);
app.use('/api/product', isLoggedIn, productRoutes);
app.use('/api/task', isLoggedIn, taskRoutes);
app.use('/api/order', isLoggedIn, orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
