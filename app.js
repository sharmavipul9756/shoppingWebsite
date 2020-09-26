const path = require('path');
const csrf = require('csurf')
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash')
const multer = require('multer');
const MongoDbStore = require('connect-mongodb-session')(session)


const errorController = require('./controllers/error');
const User = require('./models/user');
const MONGODB_URI = 'mongodb+srv://new_user:14082020@cluster0.wjkej.azure.mongodb.net/shop'

const app = express();
const Store =new MongoDbStore({
  uri: MONGODB_URI,
  collection : 'sessions'
});

const csrfProtection = csrf();
const fileStorage = multer.diskStorage({
  destination: (req,file,cb) => {
    cb(null,'images')
  },
  filename: (req,file,cb) => {
    cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname)
  }
})

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth'); 


app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({storage: fileStorage}).fields([{
  name: 'image1' , maxCount:1 },
  {name: 'image2' , maxCount:1},
  {name: 'image3' , maxCount:1},
]));


app.use(express.static(path.join(__dirname, 'public')));
app.use('/images',express.static(path.join(__dirname, 'images')));
app.use(session({secret: 'my-secret', resave: false, saveUninitialized: false,store: Store}))
app.use(csrfProtection);
app.use(flash())

app.use((req,res,next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken =  req.csrfToken();
  next()
})

app.use((req, res, next) => {
  if(!req.session.user) {
    return next()
  }
  User.findById(req.session.user._id)
    .then(user => {
      if(!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err =>
       {next(new Error(err))});
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// app.use('/500',errorController.get500);

app.use(errorController.get404);


mongoose.connect(MONGODB_URI).then(
 result => {
  
    app.listen(3000);
  }
).catch(
  err => {console.log(err)}
)
