const TelegramBot = require('node-telegram-bot-api');
const { Configuration, OpenAIApi } = require("openai");
const dotenv = require('dotenv');
// Load environment variables from .env file
dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
// Create a new instance of the OpenAI API with the API key loaded from the .env file
const openaiApi = new OpenAIApi(configuration);

// Create a new instance of the Telegram bot with the token loaded from the .env file
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Store user sessions
const sessions = {};

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const welcomeMessage = 'Hello! I\'m a chatbot powered by OpenAI. Send me a message and I\'ll try my best to respond.';
    bot.sendMessage(chatId, welcomeMessage);
});

bot.onText(/\/ask (.+)/, async (msg, match) => {
    try {
        const chatId = msg.chat.id;
        const userMessage = match[1];

        // Send the user's message to the ChatGPT API
        const completion = await openaiApi.createCompletion({
            model: "text-davinci-003",
            prompt: `${userMessage} write it in 100 words or less`,
            max_tokens: 100
        })
        // Get the response from the ChatGPT API and send it back to the user
        const botMessage = completion.data.choices[0].text;
        await bot.sendMessage(chatId, botMessage);

    } catch (error) {
        console.error(error);
    }
});
