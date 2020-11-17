// const db = knex({
//     client: 'pg',
//     connection: {
//       host : '127.0.0.1',
//       user : 'postgres',
//       password : 'test',
//       database : 'facerecognition'
//     }
//   });
//   const bcrypt = require('bcrypt-nodejs');

// we can also do the same using dependancy injection

const handleRegister = (req, res, db, bcrypt)=>{
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
}
module.exports ={
    handleRegister: handleRegister
};