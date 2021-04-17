const express  = require('express');
const router = express.Router();
const {register, login, remove, getAllUsers, getUserAndTasks} = require('../controller/user');
const  {authorization, auth}=require('../middlewares/index');


router.post('/register', authorization, register);
router.delete('/:id', authorization, remove);
router.post('/signin', login);
router.get('/', auth, getAllUsers);
router.get('/:id', auth, getUserAndTasks);

module.exports = router;