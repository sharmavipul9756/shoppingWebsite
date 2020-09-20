// const { resolveInclude } = require('ejs');
const crypto = require('crypto');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const sendGrid = require('nodemailer-sendgrid-transport');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const user = require('../models/user');

const transporter = nodemailer.createTransport(sendgridTransport({
  auth : {
    api_key: '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'
  }
}))

exports.getLogin = (req, res, next) => {
  let message = req.flash('error')
  if(message.length > 0) {
    message = message[0]
  }
  else {
    message = null
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
    errorMessage: message
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({email: email})
    .then(user => {
      if(!user) {
        req.flash('error','invalid email or password')
        return res.redirect('/login')
      }
      bcrypt.compare(password,user.password).then(
        doMatch => {
          if(doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
            console.log(err)
            return res.redirect('/')

      });
          }
          res.redirect('/login')
        }
      ).catch(err=> {
        console.log(err)
        res.redirect('login');
      })
      
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash('error','email exist already')
        return res.redirect("/signup");
      }
      return bcrypt.hash(password, 12).then((hashPassword) => {
        const user = new User({
          email: email,
          password: hashPassword,
          cart: { item: [] },
        });
        return user.save();
      });
    })
    .then((result) => {
      res.redirect("/login");
      return transporter.sendMail({
        to: email,
        from: 'admin@teamdowhile.com',
        subject: 'Signup Succeed',
        html: '<h1>You successfully signed up</h1>'
      }).then(result => {
            console.log('mail successful')
      })
      .catch(err => {
        console.log(err)
      })
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};


exports.getReset = (req,res,next) => {
  let message = req.flash('error')
  if(message.length > 0) {
    message = message[0]
  }
  else {
    message = null
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  });
}

exports.postReset = (req,res,next) => {
  crypto.randomBytes(32,(err,buffer) => {
    if(err) {
      console.log(err)
      return res.redirect('/reset')
    }
    const token = buffer.toString('hex');
    User.findOne({email: req.body.email}).then(
      user => {
        if(!user) {
          req.flash('error','No account with that email found')
          return res.redirect('/reset')
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      }
    ).then(
      result => {
        res.redirect('/');
        transporter.sendMail({
          to: req.body.email,
          from: 'admin@teamdowhile.com',
          subject: 'Password Reset',
          html: `<p>You requested password reset</p>
                 <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to password reset</p>`
        })

      }
    ).catch(err => {
      console.log(err)
    })
  })
}

exports.getNewPassword = (req,res,next) => {
  const token = req.params.token;
  User.findOne({resetToken: token, resetTokenExpiration: {$gt : Date.now()}})
  .then(user => {
    let message = req.flash('error')
  if(message.length > 0) {
    message = message[0]
  }
  else {
    message = null
  }
  
    res.render('auth/new-password', {
    path: '/new-password',
    pageTitle: 'New Password',
    errorMessage: message,
    userId : user._id.toString(),
    passwordToken: token
  })}
  )
  .catch(err => {
    console.log(err)
  })
  

};

exports.postNewPassword = (req,res,next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;

    User.findOne({resetToken: token, resetTokenExpiration: {$gt : Date.now()} , 
  _id : userId})
  .then(user => {
    resetUser = user;
    return bcrypt.hash(newPassword,12)
  })
  .then(hashedPassword => {
    resetUser.password = hashedPassword;
    resetUser.resetToken = undefined;
    resetUser.resetTokenExpiration = undefined;
    return resetUser.save()
  })
  .then(user => {
    res.redirect('/login')
  })
  .catch(err => {
    console.log(err)
  })
};