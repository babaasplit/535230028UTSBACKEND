const express = require('express');
const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const bankocsControllers = require('./BANKOCS-controller');
const bankocsValidator = require('./BANKOCS-validator.js');

const route = express.Router();

module.exports = (app) => {
  app.use('/bankocs', route);

  // Get list of accounts
  route.get('/', authenticationMiddleware, (req, res, next) => {
    bankocsControllers.getAccounts(req, res, next).catch(next);
  });

  // Login user
  route.post(
    '/login',
    celebrate(bankocsValidator.mauLogin),
    bankocsControllers.login
  );

  // Create user
  route.post(
    '/',
    authenticationMiddleware,
    celebrate(bankocsValidator.bikinAkun),
    bankocsControllers.createAccount
  );

  // User mau melakukan transaksi
  route.put(
    '/transaction/:id',
    authenticationMiddleware,
    celebrate(bankocsValidator.transaksiBos),
    bankocsControllers.transaction
  );

  // User mau ganti nomor telepon
  route.patch(
    '/change-phone-number/:id',
    authenticationMiddleware,
    celebrate(bankocsValidator.updatePhoneNumber),
    bankocsControllers.updatePhoneNumber
  );

  // Delete user
  route.delete(
    '/delete/:id',
    authenticationMiddleware,
    celebrate(bankocsValidator.deleteUser),
    bankocsControllers.deleteUser
  );
};
