const express = require('express');
const account = require('./account');
const record = require('./record');
const notices = require('./notices');

const router = express.Router();
 
// 계정 관련
router.use('/account', account);
// 요약 기록 관련
router.use('/record', record);
// 공지 관련
router.use('/notices', notices);
 
module.exports = router;