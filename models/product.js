const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  imageUrl2: {
    type: String,
    required: true
  },
  imageUrl3: {
    type: String,
    required: true
  },
  idProof: {
    type: String,
    required: true
  },
  birth: {
    type: String,
    required: true
  },
  birth1: {
    type: String,
    required: true
  },
  religion: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  phNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },

  country: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  postal: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

module.exports = mongoose.model('Product',productSchema)

