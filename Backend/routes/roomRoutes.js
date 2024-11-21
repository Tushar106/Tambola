const express=require('express');
const router=express.Router();
const roomController=require('../controllers/roomControllers');

// create room
router.post('/create-room', (req, res) => roomController.createRoom(req, res, req.io));

// join room
router.post('/join-room',(req, res) => roomController.joinRoom(req, res, req.io));

router.post('/start-room',(req, res) => roomController.startRoom(req, res, req.io));

router.post('/fetch-room',(req, res) => roomController.fetchRoom(req, res, req.io));

module.exports= router;
