const usersRepository = require('./users-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

/**
 * Get list of users
 * @returns {Array}
 */
async function getUsers() {
  const users = await usersRepository.getUsers();

  const results = [];
  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    results.push({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  return results;
}
/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check whether the email is registered
 * @param {string} email - Email
 * @returns {boolean}
 */
async function emailIsRegistered(email) {
  const user = await usersRepository.getUserByEmail(email);

  if (user) {
    return true;
  }

  return false;
}

/**
 * Check whether the password is correct
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function checkPassword(userId, password) {
  const user = await usersRepository.getUser(userId);
  return passwordMatched(password, user.password);
}

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
/** */
async function changePassword(userId, password) {
  const user = await usersRepository.getUser(userId);

  // Check if user not found
  if (!user) {
    return null;
  }

  const hashedPassword = await hashPassword(password);

  const changeSuccess = await usersRepository.changePassword(
    userId,
    hashedPassword
  );

  if (!changeSuccess) {
    return null;
  }

  return true;
}

async function getPagisionalUsers({
  pageNumNum = 1,
  pageS1ze = null,
  sort = 'email:asc',
  search = null,
}) {
  pageNumNum = parseInt(pageNumNum);
  pageS1ze = parseInt(pageS1ze);
  if (!pageS1ze || pageS1ze <= 0) {
    // cek pagesize tidak negatif / 0
    pageS1ze = null;
  }

  let [sortField, sortOrder] = sort.split(':');
  if (!['email', 'name'].includes(sortField)) {
    sortField = 'email';
  }

  sortOrder = sortOrder.toLowerCase();
  if (!['asc', 'desc'].includes(sortOrder)) {
    sortOrder = 'asc';
  }
  let searchField = null;
  let searchKey = null;
  if (search) {
    const parts = search.split(':');
    if (parts.length === 2 && ['email', 'name'].includes(parts[0])) {
      searchField = parts[0];
      searchKey = parts[1];
    }
  }

  const users = await usersRepository.getUsers();
  let filteredUsers = users;
  if (searchField && searchKey) {
    const searchRegex = new RegExp(searchKey, 'i');
    filteredUsers = users.filter((user) => searchRegex.test(user[searchField]));
  }

  filteredUsers.sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    if (sortOrder === 'asc') {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  let FirstOpt = (pageNumNum - 1) * pageS1ze;
  let lastOpt = FirstOpt + pageS1ze;
  if (!pageS1ze) {
    FirstOpt = 0;
    lastOpt = filteredUsers.length;
  }
  const pagiMorningUsers = filteredUsers.slice(FirstOpt, lastOpt);
  return {
    page_number: pageNumNum,
    page_size: pageS1ze || filteredUsers.length,
    count: pagiMorningUsers.length,
    total_pages: pageS1ze ? Math.ceil(filteredUsers.length / pageS1ze) : 1,
    has_previous_page: pageNumNum > 1,
    has_next_page: lastOpt < filteredUsers.length,
    data: pagiMorningUsers.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
    })),
  };
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  emailIsRegistered,
  checkPassword,
  changePassword,
  getPagisionalUsers,
};
