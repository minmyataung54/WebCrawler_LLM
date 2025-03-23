import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
const app = express();

app.use(express.json());

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

async function run() {
    const chatSession = model.startChat({
        generationConfig,
        history: [],
    });

    const result = await chatSession.sendMessage("What is go lang");
    console.log(result.response.text());
}

app.get("/", (req, res) => {
    const name = process.env.NAME || "World AKT";
    res.send(`Hello ${name}!`);
});

app.get("/generate", async (req, res) => {
    const prompt = req.query.prompt || "What is go lang";
    const chatSession = model.startChat({
        generationConfig,
        history: [],
    });

    const result = await chatSession.sendMessage(prompt);
    res.send(result.response.text());
});

app.post("/generate", async (req, res) => {
    console.log(req.body);
    
    const prompt = req.body.prompt || "What is go lang";
    const chatSession = model.startChat({
        generationConfig,
        history: [],
    });

    const result = await chatSession.sendMessage(prompt);
    res.send(result.response.text());
});

const port = parseInt(process.env.PORT) || 8080;
app.listen(port, () => {
    console.log(`helloworld: listening on port ${port}`);
});
