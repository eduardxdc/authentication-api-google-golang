const express = require('express');
const crypto = require('crypto');
const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  "private token for the code to upload to github, if you want to use it on your machine, read google's api documentation to generate your own;",
  "private token for the code to upload to github, if you want to use it on your machine, read google's api documentation to generate your own;",
  "http://localhost:8080/callback"
);

const oauthStateString = crypto.randomBytes(32).toString('base64').slice(0, 32);

const app = express();

app.get('/', (_, res) => {
  res.send('<html><body><a href="/login">LOGIN</a></body></html>');
});

app.get('/login', (_, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['profile', 'email'],
    state: oauthStateString
  });
  res.redirect(authUrl);
});

app.get('/callback', async (req, res) => {
  const { state, code } = req.query;
  if (state !== oauthStateString) {
    console.log('Estado inválido');
    return res.redirect('/');
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    res.send(`Token de acesso: ${tokens.access_token}`);
  } catch (err) {
    console.error('Erro ao trocar o código por token:', err);
    res.redirect('/');
  }
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor executando na porta ${PORT}`);
});
