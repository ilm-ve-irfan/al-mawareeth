import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Al-Mawareeth API running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});
