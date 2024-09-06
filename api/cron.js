const axios = require('axios');

export default async function handler(req, res) {
    // Authorization 체크
    if (req.headers['authorization'] !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).end('Unauthorized');
    }

    const today = new Date().toLocaleDateString('ko-KR', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const message = `오늘 날짜: ${today}`;

    try {
        // Slack으로 메시지 보내기
        await axios.post('https://slack.com/api/chat.postMessage', {
            channel: process.env.CHANNEL_ID,
            text: message,
            thread_ts: process.env.THREAD_TS,
        }, {
            headers: {
                Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        res.status(200).end('Message sent!');
    } catch (error) {
        console.error(error);
        res.status(500).end('Error sending message');
    }
}
