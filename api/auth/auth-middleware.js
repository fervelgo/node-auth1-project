const bcrypt = require('bcryptjs')
const User = require('../users/users-model')
/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
const restricted = async (req, res, next) => {
  try {
    const { username, password } = req.body
    const [existingUser] = await User.findBy({ username })
    if(bcrypt.compareSync(password, existingUser.password)){
      res.json({ message: `welcome back ${existingUser}`})
      next()
    } else {
      next({ message: "You shall not pass!", status: 401})
    }
  } catch(err) {
    next(err)
  }
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
const checkUsernameFree = async (req, res, next) => {
try{
  const { username } = req.body
 const existingUser = User.findBy(username)
 if (!existingUser) {
   next()
 } else {
   next({status: 422, message: "Username taken"})
 }
} catch (err) {
  next(err)
}
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
const checkUsernameExists = (req, res, next) => {
  try{
  const { username } = req.body
   const existingUser = User.findBy(username)
   if (!existingUser) {
    next({status: 401, message: "Invalid credentials"})
   } else {
     req.user = existingUser
     next()
   }
  } catch (err) {
    next(err)
  }
  }


/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
const checkPasswordLength = (req, res, next) => {
  try{
    const { password } = req.body
    if(!password || password.length < 3) {
      next({message: "Password must be longer than 3 chars"})
    }
  } catch (err) {
    next(err)
  }

}


module.exports = {
  restricted,
  checkPasswordLength,
  checkUsernameExists,
  checkUsernameFree
}
// Don't forget to add these to the `exports` object so they can be required in other modules
