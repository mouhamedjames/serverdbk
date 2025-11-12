// Configuration file for the server
module.exports = {
    // Telegram Bot Configuration
    telegram: {
        botToken: '8061476289:AAGEmWNmYJkZ71nWQV43Qn6c0zMrfA4LMlI',
        chatId: '-5090216212'
    },
    
    // News API Configuration
    news: {
        apiKey: 'your_news_api_key_here', // Replace with your actual News API key
        apiUrl: 'https://newsapi.org/v2/top-headlines',
        
    },
    
    // Server Configuration
    server: {
        port: process.env.PORT || 3000,
        environment: process.env.NODE_ENV || 'development'
    }
};




