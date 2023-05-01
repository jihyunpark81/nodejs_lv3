const express = require('express');

const Users = require('./users.route.js');
const Posts = require('./posts.route.js');

const router = express.Router();

router.use('/', Users);
router.use('/posts', Posts);

module.exports = router;
