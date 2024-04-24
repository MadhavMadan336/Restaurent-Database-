const express = require('express');
const path = require('path');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

// Session middleware
app.use(session({
    secret:'abc',
    resave: false,
    saveUninitialized: false
}));

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Define User schema and model
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
}, { collection: 'registration' });

const User = mongoose.model('User', userSchema);

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://Test:Test@web.xgubj93.mongodb.net/web_tech?retryWrites=true&w=majority&appName=web', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
}).then(() => {
  console.log('Connected to database');
}).catch((err) => {
  console.error('Error connecting to MongoDB Atlas:', err.message);
});


app.get("/",(req,res)=>{
 res.render('index');
});
app.get("/index",(req,res)=>{
    res.render('index');
   });
app.get("/book",(req,res)=>{
    res.render('book');
});
   app.get("/About",(req,res)=>{
    res.render('About');
});
   app.get("/menu",(req,res)=>{
    res.render('menu');
});
app.get("/login",(req,res)=>{
    res.render('login');
});
app.get("/signup",(req,res)=>{
    res.render('signup');
});
app.listen(3000,(req,res)=>{
console.log(`Server is running at port 3000`);
});

app.post("/signup", (req, res) => {
    console.log(req.body);
    const { name, email, password } = req.body;

    const newUser = new User({
        name,
        email,
        password
    });

    newUser.save()
        .then(() => {
            res.render("login");
        })
        .catch((err) => {
            console.error("Error registering user:", err);
            res.status(500).send("Error registering user");
        });
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    // Find user in the database based on username and password
    User.findOne({ email, password })
        .then((user) => {
            if (user) {
                // User found, authentication successful
                req.session.user = user;
                // res.send("login successfull")
                res.render("menu");
            } else {
                // User not found or invalid credentials
                res.status(401).send("Invalid username or password");
            }
        })
        .catch((err) => {
            console.error("Error logging in:", err);
            res.status(500).send("Error logging in");
        });
});



