const crypto = require('crypto');
const express = require('express');
const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  "1039393286929-ptaonfdeqgooa2jjg2e3rd480iesfrms.apps.googleusercontent.com",
  "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",
  "http://localhost:8080/callback"
);

const scopes = ['profile', 'email'];
const oauthStateString = generateRandomString(32);

const app = express();

app.get('/', (req, res) => {
  const htmlIndex = `<html><body><a href="/login">CONSEGUI CARALHO</a></body></html>`;
  res.send(htmlIndex);
});

app.get('/login', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    state: oauthStateString
  });
  res.redirect(url);
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

function generateRandomString(length) {
  return crypto.randomBytes(length).toString('base64').slice(0, length);
}

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor executando na porta ${PORT}`);
});
