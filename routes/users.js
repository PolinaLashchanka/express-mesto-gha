const router = require('express').Router();
const { getUsers, getUserById, createUser, updateUser } = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', createUser);
router.patch('/me', updateUser);

module.exports = router;
