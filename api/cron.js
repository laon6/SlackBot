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

    const message = `[${today}] ${new Date()} \n슬랙 확인 후 확인완료 댓글 달아주세요.`;
    //<!channel> 
    try {
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

        console.log(new Date());


        res.status(200).end('Message sent!');
    } catch (error) {
        console.error(error);
        res.status(500).end('Error sending message');
    }
}
