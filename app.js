// === backend/app.js ===
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Simple disaster creation endpoint
app.post('/disasters', async (req, res) => {
  const { title, location_name, description, tags } = req.body;
  const { data, error } = await supabase.from('disasters').insert([
    {
      title,
      location_name,
      description,
      tags,
      created_at: new Date().toISOString(),
    },
  ]);
  if (error) return res.status(500).json({ error });
  res.status(201).json(data);
});

// Fetch disasters
app.get('/disasters', async (req, res) => {
  const { tag } = req.query;
  let query = supabase.from('disasters').select('*');
  if (tag) query = query.contains('tags', [tag]);
  const { data, error } = await query;
  if (error) return res.status(500).json({ error });
  res.json(data);
});

app.listen(3000, () => console.log('Backend running on http://localhost:3000'));

