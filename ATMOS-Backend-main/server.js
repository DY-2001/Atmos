require("dotenv").config();
// const app = require('./app');
const server = require('./app');
const {connectDB} = require('./config/db');
const port = process.env.PORT || 4000;

connectDB();

// app.listen(port, () => {
//     console.log(`ATMOS Backend server started on port ${port}`);
//     // connectDB();
// });

server.listen(port, () => console.log(`Server is running on port ${port}`));