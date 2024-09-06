const axios = require('axios');
require('dotenv').config();

module.exports = async (req, res) => {
    const today = new Date().toLocaleDateString('ko-KR', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const message = `오늘 날짜: ${today}`;

    try {
        await axios.post('https://slack.com/api/chat.postMessage', {
            channel: process.env.CHANNEL_ID,
            text: message,
            thread_ts: process.env.THREAD_TS,  // 스레드에 댓글로 달기
        }, {
            headers: {
                Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
};
