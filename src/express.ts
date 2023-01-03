import express from 'express';
import cors from 'cors';
import bodyparser from 'body-parser';
import playerCards from './players';
import INDEX from './index.html';

const app = express()
  .use((req, res) => {
    res.sendFile(INDEX, { root: __dirname });
  })
  .use(bodyparser.json())
  .use(cors());

app
  .route('/player-cards')
  .get((req, res) => {
    res.json(playerCards);
  })
  .post((req, res) => {
    const playerCard = req.body;
    const id = playerCards.length;
    playerCards.push({ ...playerCard, id });
    res.json(playerCards);
  })
  .delete((req, res) => {
    const id = Number(req.query.id);
    playerCards.splice(id, 1);
    res.json(playerCards);
  })
  .put((req, res) => {
    const id = Number(req.query.id);
    const playerCard = req.body;
    playerCards.splice(id, 1, playerCard);
    res.json(playerCards);
  });

export default app;
