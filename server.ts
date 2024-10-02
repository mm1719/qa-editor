import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public')); // 將 public 資料夾設為靜態檔案夾

// 讀取檔案
app.get('/load', (req: Request, res: Response) => {
    const filename = req.query.filename as string;
    const filepath = path.join(__dirname, filename);

    if (!fs.existsSync(filepath)) {
        return res.status(404).send('File not found');
    }

    const fileContent = fs.readFileSync(filepath, 'utf-8');
    const conversations = fileContent.split('\n').map(line => JSON.parse(line));
    res.json(conversations);
});

// 儲存檔案
app.post('/save', (req: Request, res: Response) => {
    const { filename, updatedConversations } = req.body;
    const filepath = path.join(__dirname, filename);

    const fileContent = updatedConversations.map((conv: any) => JSON.stringify(conv)).join('\n');
    fs.writeFileSync(filepath, fileContent, 'utf-8');

    res.status(200).send('File saved');
});

// 定義根路由
app.get('/', (req: Request, res: Response) => {
    res.send('Hello, this is the root route!');
});

// 定義測試路由
app.get('/test', (req: Request, res: Response) => {
    res.send('Test route is working!');
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
