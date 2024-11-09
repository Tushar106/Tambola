const express=require('express');
const router=express.Router();
const auth=require('../middleware/auth')
const roomController=require('../controllers/roomControllers');

// create room
router.post('/create-room',auth, (req, res) => roomController.createRoom(req, res, global.io));

// join room
router.post('/join-room',auth,(req, res) => roomController.joinRoom(req, res, global.io));

module.exports= router;
