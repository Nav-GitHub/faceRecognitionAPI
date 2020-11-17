const handleImage = (req, res, db)=>{
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
   
}

// module.exports = {
//     handleImage: handleImage
// }
// same can be said using es6

module.exports = {
    handleImage
};