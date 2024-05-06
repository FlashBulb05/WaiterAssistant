const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cors = require('cors'); // Aggiunto il modulo CORS

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors()); // Utilizzo del middleware CORS per abilitare le richieste da tutti gli origini

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'wa_db'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connesso al database MySQL');
});

app.post('/register', (req, res) => {
  const { username, password, ruolo } = req.body;
  
  // Genera un salt casuale
  const salt = bcrypt.genSaltSync(saltRounds);
  
  // Esegui l'hash della password con il salt
  const hashedPassword = bcrypt.hashSync(password, salt);

  const user = { username, password: hashedPassword, ruolo };
  db.query('INSERT INTO users SET ?', user, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Errore durante la registrazione');
    }
    res.status(200).send('Registrazione avvenuta con successo');
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Errore durante il login');
    }
    if (results.length === 0) {
      return res.status(401).send('Nome utente o password errati');
    }
    const user = results[0];
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (passwordMatch) {
      res.status(200).json({ ruolo: user.ruolo });
    } else {
      res.status(401).send('Nome utente o password errati');
    }
  });
});



app.listen(port, () => {
  console.log(`Server in esecuzione sulla porta ${port}`);
});
