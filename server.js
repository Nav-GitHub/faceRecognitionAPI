const express =require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex =require('knex');
const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'test',
      database : 'facerecognition'
    }
  });
const register =require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');


const app =express();
app.listen(process.env.PORT||3002, () => {
    console.log(`app is running on port ${process.env.PORT}   `);
});
//
// Middlewares
//
app.use(express.json());// middleware to change json to javascript 
app.use(cors()); // alow trust the connection for the browser

app.get('/', (req, res) => { res.send(database.users);});
app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)});
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)});
app.get('/profile/:id', (req, res) => profile.handleProfileGet(req,res,db));
app.put('/image', (req, res) => image.handleImage(req, res, db));

