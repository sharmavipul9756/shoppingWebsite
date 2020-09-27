const Product = require('../models/product');
const { count } = require('../models/user');
const user = require('../models/user');

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
  const birth1 = req.body.birth1
  const description = req.body.description;
  const religion = req.body.religion;
  const gender = req.body.gender;
  const phNumber = req.body.phNumber;
  const email = req.body.email;
  const country = req.body.country;
  const address = req.body.address;
  const postal = req.body.postal; 
  const image1 = req.files['image1'][0];
  const image2 = req.files['image2'][0];
  const image3 = req.files['image3'][0];
  const idProofString = req.files['idProofString'][0];
  // console.log(imageUrl)
  const imageUrl = image1.path;
  const imageUrl2 = image2.path;
  const imageUrl3 = image3.path;
  const idProof = idProofString.path; 
  // console.log(imageUrl)

  const product = new Product({
    firstName: firstName.toUpperCase(),
    lastName: lastName.toUpperCase(),
    description: description,
    birth : birth,
    birth1 : birth1,
    religion:religion,
    gender:gender,
    phNumber:phNumber,
    email:email,
    country: country,
    address:address,
    postal:postal,
    imageUrl:imageUrl,
    imageUrl2:imageUrl2,
    imageUrl3:imageUrl3, 
    idProof: idProof,
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
  const updatedBirth1 = req.body.birth1
  const updatedDescription = req.body.description;
  const updatedReligion = req.body.religion;
  const updatedGender = req.body.gender;
  const updatedNumber = req.body.phNumber;
  const updatedEmail = req.body.email;
  const updatedCountry = req.body.country;
  const updatedAddress = req.body.address;
  const updatedPostal = req.body.postal; 
  const image1 = req.files['image1'];
  const image2 = req.files['image2'];
  const image3 = req.files['image3'];
  const idProofString = req.files['idProofString'];
  

  Product.findById(prodId)
    .then(product => {
      if(product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      product.firstName = updatedFirstName;
      product.lastName = updatedLastName;
      product.description = updatedDescription;
      product.birth = updatedDob;
      product.birth1 = updatedBirth1;
      product.religion = updatedReligion;
      product.gender = updatedGender;
      product.phNumber = updatedNumber;
      product.email = updatedEmail;
      product.country = updatedCountry;
      product.address = updatedAddress;
      product.postal = updatedPostal;
      if(image1) {
      product.imageUrl = image1.path;
      }
      if(image2) {
      product.imageUrl2 = image2.path;
      }
      if(image3) {
      product.imageUrl3 = image3.path;
      }
      if(idProof) {
        product.idProof = idProofString.path;
      }



      return product.save()
      .then(result => {
        console.log('UPDATED PRODUCT!');
        res.redirect('/admin/products');
      })
    })
    
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find({userId : req.user._id})
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
  Product.deleteOne({_id: prodId,userId: req.user._id})
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};
