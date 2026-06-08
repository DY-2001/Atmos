require("dotenv").config();
// const app = require('./app');
const server = require('./app');
const { connectDB } = require('./config/db');
const port = process.env.PORT || 4000;

const { GoogleGenerativeAI } = require("@google/generative-ai");

connectDB();

// Connect to Gemini AI
try {
    global.ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log("🤖 Gemini AI SDK Initialized");
} catch (err) {
    console.error("❌ Gemini SDK Initialization Failed:", err);
}

// app.listen(port, () => {
//     console.log(`ATMOS Backend server started on port ${port}`);
//     // connectDB();
// });

server.listen(port, () => console.log(`Server is running on port ${port}`));