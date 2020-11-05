const express =require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');


const app =express();
app.listen(3002, () => {
    console.log('app is running on port 3002   ');
});
//
// Middlewares
//
app.use(express.json());// middleware to change json to javascript 
app.use(cors());


const database = {
    users:[{
        id:'123',
        name:'john',
        email: 'john@gmail.com',
        password: 'cookies',
        entries: 0,
        joined:new Date()
    },
    {
        id:'124',
        name:'Sally',
        email: 'sally@gmail.com',
        password: 'bananas',
        entries: 0,
        joined:new Date()
    }
]
}


app.get('/', (req, res) => {
    res.send(database.users);
});
app.post('/signin', (req, res) => {
    if(req.body.email === database.users[0].email && req.body.password === database.users[0].password){
        res.json("user exist");
    }
    else{
        res.status(400).json('user doesnot exist');
    }
});
app.post('/register', (req,res)=>{
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;

    database.users.push({
        id:'125',
        name: name,
        email: email,
        // password: password, // we dont want to return the password for security reasons
        entries: 0,
        joined:new Date()
    })

    res.json(database.users[database.users.length -1]);
});
app.get('/profile/:id', (req,res)=>{
    const id = req.params.id;
    //or we can also say
    // const {id} =req.params
    let found =false;
    database.users.forEach(
        (user) => {
            if(user.id === id){
                found =true;
                return(res.json(user));
            }
         } 
    );
         if(!found){
            res.status(404).json('no such user');
         }
   
});
app.put('/image', (req,res)=>{
    const id = req.body.id;
    //or we can also say
    // const {id} =req.params
    let found =false;
    database.users.forEach(
        (user) => {
            if(user.id === id){
                found =true;
                user.entries++;
                return(res.json(user.entries));
            }
         } 
    );
         if(!found){
            res.status(404).json('no such user');
         }
   
});


// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });