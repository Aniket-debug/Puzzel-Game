const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcrypt")
const { emit } = require("nodemon")

function initialize(passport, getUserByEmail, getUserById ){
    // function to authenticat users
    const authenticatUsers = async (email, password, done)=> {
        // get user by email
        const user = getUserByEmail(email)
        if (user==null){
            return done(null, false, {message: "No user with that email"})
        }
        try{
            if (await bcrypt.compare(password, user.password)){
                return done(null, user)
            }else{
                return done(null, false, {message: "password Incorrect"})
            }
        }catch (e){
            console.log(e)
            return done(e)
        }
    }

    passport.use(new LocalStrategy({usernameField: 'email'}, authenticatUsers))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    })
}

module.exports = initialize