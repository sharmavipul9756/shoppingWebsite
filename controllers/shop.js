const Product = require('../models/product');
// const stripe = require('stripe')('sk_test_51HVx9ZGhHrWNdBHOq8vtsvM0gXu4omgWgbmjCr8iexRvnlZ9WKAcqFyvrXda3upvfLGS2FIvCk8ohLzfToRmec5I00rcQIZclC')


exports.getProducts = (req, res, next) => {
  // Product.find()
  // userId = req.user;
  // if(!Product.find({userId : req.user._id})) {
    Product.find({userId : {$nin : req.user._id} })
    .then(products => {
      console.log(products);
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Profiles',
        path: '/products',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => {
      console.log(err);
    }); 
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
 
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  // userId = req.user;
  Product.find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Home',
        path: '/',
       
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  let products;
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items;
      // return stripe.getCheckout.sessions.create()
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Favourites',
        products: products,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log(result);
      res.redirect('/cart');
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.getCheckout = (req,res,next) => {
  res.render('shop/product-detail', {
    product: product,
    pageTitle: product.title,
    path: '/products',
    isAuthenticated: req.session.isLoggedIn
  });
};

