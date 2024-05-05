const joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = joi.extend(joiPasswordExtendCore);

module.exports = {
  bikinAkun: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      email: joi.string().email().required().label('Email'),
      password: joiPassword
        .string()
        .minOfSpecialCharacters(1)
        .minOfLowercase(1)
        .minOfUppercase(1)
        .minOfNumeric(1)
        .noWhiteSpaces()
        .onlyLatinCharacters()
        .min(6)
        .max(32)
        .required()
        .label('Password'),
      password_confirm: joi.string().required().label('Password confirmation'),
    },
  },

  mauLogin: {
    body: {
      email: joi.string().email().required().label('Email'),
      password: joiPassword
        .string()
        .minOfSpecialCharacters(1)
        .minOfLowercase(1)
        .minOfUppercase(1)
        .minOfNumeric(1)
        .noWhiteSpaces()
        .onlyLatinCharacters()
        .min(6)
        .max(32)
        .required()
        .label('Password'),
    },
  },

  transaksiBos: {
    body: {
      id: joi.string().required().label('Id tujuan'),
      amount: joi.number().integer().required().label('Jumlah dana transaksi.'),
    },
  },

  updatePhoneNumber: {
    body: {
      phoneNumber: joi
        .number()
        .integer()
        .min(12)
        .required()
        .label('Nomor Telepon'),
    },
  },

  deleteUser: {
    body: {
      email: joi.string().email().required().label('Email'),
      name: joi.string().min(1).max(100).required().label('Name'),
      password: joiPassword
        .string()
        .minOfSpecialCharacters(1)
        .minOfLowercase(1)
        .minOfUppercase(1)
        .minOfNumeric(1)
        .noWhiteSpaces()
        .onlyLatinCharacters()
        .min(6)
        .max(32)
        .required()
        .label('Password'),
    },
  },
};
