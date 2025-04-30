const mongoose = require('mongoose');
const { Schema } = mongoose;

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validatePassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: {
      validator: validateEmail,
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    validate: {
      validator: validatePassword,
      message: () => `Password must contain at least:
       - 8 characters
       - 1 uppercase letter
       - 1 lowercase letter
       - 1 number
       - 1 special character (@$!%*?&)`,
    },
    select: false,
  },
  country: {
    type: String,
    required: [true, 'country is required']
  },
  profileImage: {
    type: String,
    required: null,
  }

}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);
module.exports = User;
