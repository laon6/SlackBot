import axios from 'axios';

export default async function handler(req, res) {
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
        const response = await axios.post('https://slack.com/api/chat.postMessage', {
            channel: process.env.CHANNEL_ID,
            text: message,
            thread_ts: process.env.THREAD_TS,
        }, {
            headers: {
                Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('Slack API response:', response.data);  // Slack API 응답 출력

        if (!response.data.ok) {
            console.error('Error from Slack API:', response.data.error);
            return res.status(500).end(`Error: ${response.data.error}`);
        }

        res.status(200).end('Message sent!');
    } catch (error) {
        console.error(error);
        res.status(500).end('Error sending message');
    }
}
