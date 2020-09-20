const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  if(!req.session.isLoggedIn) {
    return res.redirect('/login');
  }
  res.render('admin/edit-product', {
    pageTitle: 'Register',
    path: '/admin/add-product',
    editing: false,
    isAuthenticated: req.session.isLoggedIn
  });
};

exports.postAddProduct = (req, res, next) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const birth = req.body.birth;
  const description = req.body.description;
  const religion = req.body.religion;
  const gender = req.body.gender;
  const phNumber = req.body.phNumber;
  const email = req.body.email;
  const address = req.body.address;
  const postal = req.body.postal; 
  const imageUrl = req.body.imageUrl;
  const imageUrl2 = req.body.imageUrl2;
  const imageUrl3 = req.body.imageUrl3;

  const product = new Product({
    firstName: firstName,
    lastName: lastName,
    description: description,
    birth : birth,
    religion:religion,
    gender:gender,
    phNumber:phNumber,
    email:email,
    address:address,
    postal:postal,
    imageUrl:imageUrl,
    imageUrl2:imageUrl2,
    imageUrl3:imageUrl3, 
    userId: req.user
  });
  product
    .save()
    .then(result => {
      // console.log(result);
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Profile',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedFirstName = req.body.firstName;
  const updatedLastName = req.body.lastName;
  const updatedDob = req.body.birth;
  const updatedDescription = req.body.description;
  const updatedReligion = req.body.religion;
  const updatedGender = req.body.gender;
  const updatedNumber = req.body.phNumber;
  const updatedEmail = req.body.email;
  const updatedAddress = req.body.address;
  const updatedPostal = req.body.postal; 
  const updatedImage = req.body.imageUrl;
  const updatedImage2 = req.body.imageUrl2;
  const updatedImage3 = req.body.imageUrl3;

  Product.findById(prodId)
    .then(product => {
      product.firstName = updatedFirstName;
      product.lastName = updatedLastName;
      product.description = updatedDescription;
      product.birth = updatedDob;
      product.religion = updatedReligion;
      product.gender = updatedGender;
      product.phNumber = updatedNumber;
      product.email = updatedEmail;
      product.address = updatedAddress;
      product.postal = updatedPostal;
      product.imageUrl = updatedImage;
      product.imageUrl2 = updatedImage2;
      product.imageUrl3 = updatedImage3;


      return product.save();
    })
    .then(result => {
      console.log('UPDATED PRODUCT!');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find()
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then(products => {
      console.log(products);
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Profile',
        path: '/admin/products',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};
