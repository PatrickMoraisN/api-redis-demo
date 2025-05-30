const express = require('express');
const router = express.Router();
const db = require('../db');
const redis = require('../redisClient');

let dbHits = 0;

router.get('/usuarios-sem-cache', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM usuarios');
    dbHits++;
    console.log('Consulta ao banco realizada:', dbHits);
    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar usuários sem cache:', err);
    res.status(500).send('Erro no servidor');
  }
});

router.get('/usuarios-com-cache', async (req, res) => {
  const cacheKey = 'usuarios:lista';

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const { rows } = await db.query('SELECT * FROM usuarios');
    await redis.setEx(cacheKey, 30, JSON.stringify(rows));
    dbHits++;
    console.log('Consulta ao banco realizada:', dbHits);
    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar usuários com cache:', err);
    res.status(500).send('Erro no servidor');
  }
});

module.exports = router;
