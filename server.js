if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}


const express = require("express")
const app = express()
const bcrypt = require("bcrypt")
const passport = require("passport")
const initializePassport = require("./passport-config")
const session = require("express-session")
const flash = require("express-flash")


initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id===id)
)

const users = []

app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

app.post("/login", passport.authenticate("local",{
    successRedirect:"/game",
    failureRedirect: "/login",
    failureFlash: true
}))


app.post('/register', async (req, res) => {
    try {
        if (req.body.password === req.body.confirm_password){
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            users.push({
                id: Date.now().toString(),
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword
            })
            console.log(users)
            res.redirect("/login")
        }else{
            res.redirect("/register")
        }
    } catch (e) {
        console.log(e)
        res.redirect("/register")
    }
})

app.post("/game", async (req, res) => {
    try{
        res.redirect("/")
    }
    catch (e){
        console.log(e)
    }
})

app.get('/', (req, res) => {
    res.render("index.ejs")
})
app.get('/login', (req, res) => {
    res.render("login.ejs")
})
app.get('/register', (req, res) => {
    res.render("register.ejs")
})
app.get('/admin', (req, res) => {
    res.render("admin.ejs")
})
app.get('/game', (req, res) => {
    res.render("game.ejs")
})
app.get('/dashboard', (req, res) => {
    res.render("dashboard.ejs")
})

app.listen(3000)











