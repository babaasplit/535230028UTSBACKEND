const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');

let attempts = {};

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */

async function login(req, res, next) {
  const { email, password } = req.body;

  try {
    if (!attempts[email]) {
      attempts[email] = { failed: 0, AkhirAttempt: new Date() };
    } else {
      const AkhirAttempt = attempts[email];
      const LOLelapsed = (new Date() - AkhirAttempt.AkhirAttempt) / (1000 * 60);
      if (LOLelapsed >= 30) {
        attempts[email] = {
          failed: 0,
          AkhirAttempt: new Date(),
        };
      }
    }

    const limitLewatBatas = attempts[email].failed >= 5;

    if (limitLewatBatas) {
      throw errorResponder(
        errorTypes.FORBIDDEN,
        'Too many failed login attempts. Please try again in 30 minutes'
      );
    }

    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    if (!loginSuccess) {
      attempts[email].failed++;
      const remainingAttempts = 5 - attempts[email].failed;
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        `Wrong email or password, ${remainingAttempts} chances left`
      );
    }

    attempts[email].failed = 0;
    attempts[email].AkhirAttempt = new Date();

    return res.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
