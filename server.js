const express = require('express');
const expressHandlebars = require('express-handlebars');
const config = require('config');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

wss.on('connection', (ws) => {
  ws.on('message', (messages) => {
    wss.broadcast(messages);
  });
});

app.engine('.hbs', expressHandlebars({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Working as charm',
    interval: config.interval,
  });
});

app.get('/fake', (req, res) => {
  res.render('fake', {
    title: 'Working goood!',
  });
});

server.listen(config.port, () => {
  console.log(`Application working on http://localhost:${config.port}/`);
});

