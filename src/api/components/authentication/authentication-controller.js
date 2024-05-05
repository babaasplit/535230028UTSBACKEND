const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');

let attempts = {}; // melacak percobaan login

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
      const AkhirAttempt = attempts[email]; // Mengambil catatan percobaan login sebelumnya
      const LOLelapsed = (new Date() - AkhirAttempt.AkhirAttempt) / (1000 * 60); // Mengambil catatan percobaan login sebelumnya
      if (LOLelapsed >= 30) {
        // Jika waktu elapsed sejak percobaan login terakhir lebih dari atau sama dengan 30 menit
        attempts[email] = {
          failed: 0, // Reset jumlah percobaan login gagal
          AkhirAttempt: new Date(),
        };
      }
    }

    const limitLewatBatas = attempts[email].failed >= 5; //  memeriksa apakah jumlah percobaan login yang gagal untuk alamat email  memeriksa apakah jumlah percobaan login yang gagal untuk alamat email

    if (limitLewatBatas) {
      throw errorResponder(
        errorTypes.FORBIDDEN,
        'Too many failed login attempts. Please try again in 30 minutes'
      );
    }

    const loginBerhasil = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    if (!loginBerhasil) {
      attempts[email].failed++; // Jika login tidak berhasil, jumlah percobaan login yang gagal untuk alamat email yang diberikan akan ditambahkan satu.
      const remainingAttempts = 5 - attempts[email].failed; // menghitung berapa banyak kesempatan login yang tersisa.
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        `Wrong email or password, ${remainingAttempts} chances left`
      );
    }

    attempts[email].failed = 0;
    attempts[email].AkhirAttempt = new Date();

    return res.status(200).json(loginBerhasil);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
