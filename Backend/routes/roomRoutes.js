const express=require('express');
const router=express.Router();
const roomController=require('../controllers/roomControllers');

// create room
router.post('/create-room', (req, res) => roomController.createRoom(req, res, global.io));

// join room
router.post('/join-room',(req, res) => roomController.joinRoom(req, res, global.io));

module.exports= router;
