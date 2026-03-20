const express = require('express');
const path = require('path');
const http = require('http');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 4014;
const API_BASE = process.env.API_BASE || 'http://127.0.0.1:3001';
const SESSION_TOKEN = process.env.SESSION_TOKEN;

if (!SESSION_TOKEN) {
  console.error('[ERROR] SESSION_TOKEN not set in .env');
  process.exit(1);
}

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// API Proxy: forward /api requests to backend
app.use('/api', async (req, res) => {
  const path = req.path === '/' ? '/api' : `/api${req.path}`;
  const url = new URL(path, API_BASE);
  
  // Copy query params
  for (const [key, value] of Object.entries(req.query)) {
    url.searchParams.set(key, value);
  }

  try {
    console.log(`[API PROXY] ${req.method} ${url}`);
    
    const options = {
      method: req.method,
      headers: {
        ...req.headers,
        'X-App-Token': SESSION_TOKEN,
        'Host': 'localhost:3001',
      },
    };
    delete options.headers.host;

    const apiRes = await fetch(url, {
      ...options,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });

    const contentType = apiRes.headers.get('content-type');
    const data = contentType?.includes('application/json')
      ? await apiRes.json()
      : await apiRes.text();

    res.status(apiRes.status);
    res.set('Content-Type', contentType || 'application/json');
    res.send(data);
  } catch (error) {
    console.error('[API PROXY]', error.message);
    res.status(502).json({ error: 'Backend API unreachable' });
  }
});

// Inject SESSION_TOKEN into index.html
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  let html = fs.readFileSync(indexPath, 'utf-8');
  
  // Inject token into data attribute on <html> element
  html = html.replace(
    '<html',
    `<html data-session-token="${SESSION_TOKEN}"`
  );
  
  res.set('Content-Type', 'text/html');
  res.send(html);
});

// SPA fallback: serve index.html for client-side routing
app.use((req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  let html = fs.readFileSync(indexPath, 'utf-8');
  
  // Inject token into data attribute on <html> element
  html = html.replace(
    '<html',
    `<html data-session-token="${SESSION_TOKEN}"`
  );
  
  res.set('Content-Type', 'text/html');
  res.send(html);
});

// Start server
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`[React Server] Listening on port ${PORT}`);
  console.log(`[API Proxy] Forwarding requests to ${API_BASE}`);
});
