const handleProfileGet = (req, res, db)=>{
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
   
}
module.exports = {
    handleProfileGet : handleProfileGet
};