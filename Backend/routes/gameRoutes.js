const express=require('express')
const router=express.Router();
const auth=require('../middleware/auth')
const gameController=require('../controllers/gameController');

// start game
router.post('/start-game',auth,(req, res) => gameController.startGame(req, res, global.io));

// end game
router.post('/end-game',auth,(req, res) => gameController.endGame(req, res, global.io));

// draw number
router.post('/draw-number',auth,(req, res) => gameController.drawNumber(req, res, global.io));

// check number
router.post('/check-win',auth,(req, res) => gameController.checkWin(req, res, global.io));

module.exports=router;