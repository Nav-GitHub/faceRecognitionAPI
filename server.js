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



const app =express();
app.listen(3002, () => {
    console.log('app is running on port 3002   ');
});
//
// Middlewares
//
app.use(express.json());// middleware to change json to javascript 
app.use(cors()); // alow trust the connection for the browser


// const database = {
//     users:[{
//         id:'123',
//         name:'john',
//         email: 'john@gmail.com',
//         password: 'cookies',
//         entries: 0,
//         joined:new Date()
//     },
//     {
//         id:'124',
//         name:'Sally',
//         email: 'sally@gmail.com',
//         password: 'bananas',
//         entries: 0,
//         joined:new Date()
//     }
// ]
// }


app.get('/', (req, res) => {
    res.send(database.users);
});
app.post('/signin', (req, res) => {
    // if(req.body.email === database.users[0].email && req.body.password === database.users[0].password){
    //     // res.json("user exist");
    //     res.json(database.users[0]);
    // }
    // else{
    //     res.status(400).json('user doesnot exist');
    // }
    db.select('email','hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
       const isValid = bcrypt.compareSync(req.body.password,data[0].hash);
       if(isValid)
       {
         return db.select('*').from('users')
        .where('email', '=', req.body.email)
        .then(user => {
            res.json(user[0])
        })
        .catch(err => {res.status(400).json('unable to get user')})
       }
       else{
        res.status(400).json('wrong credentials')
       }
    })
    .catch(err => res.status(400).json('wrong credentials'));
});
app.post('/register', (req,res)=>{
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail =>{
            return trx('users')
            .returning('*')
            .insert({
                email: loginEmail[0],
                name: name,
                joined: new Date()
            })
            .then(user => {
                res.json(user[0]);
            })  
        })
        .then(trx.commit)
        .catch(trx.rollback)

    })
    .catch(err => res.status(400).json('unable to register'));
    })

    // database.users.push({
    //     id:'125',
    //     name: name,
    //     email: email,
    //     // password: password, // we dont want to return the password for security reasons
    //     entries: 0,
    //     joined:new Date()
    // })

app.get('/profile/:id', (req,res)=>{
    const id = req.params.id;
    //or we can also say
    // const {id} =req.params
    let found =false;
    // database.users.forEach(
    //     (user) => {
    //         if(user.id === id){
    //             found =true;
    //             return(res.json(user));
    //         }
    //      } 
    // );
    db.select('*').where({id: id}).from('users')
    .then(user => {
        if(user.length){res.json(user[0]);}
        else{
            res.status(400).json('no such user'); 
        }
        
    }).catch(err => res.status(400).json('error getting user'))
        //  if(!found){
        //     res.status(404).json('no such user');
        //  }
   
});
app.put('/image', (req,res)=>{
    const id = req.body.id;
    //or we can also say
    // const {id} =req.params
    // let found =false;
    // database.users.forEach(
    //     (user) => {
    //         if(user.id === id){
    //             found =true;
    //             user.entries++;
    //             return(res.json(user.entries));
    //         }
    //      } 
    // );
    //      if(!found){
    //         res.status(404).json('no such user');
    //      }
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'))
   
});


// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });