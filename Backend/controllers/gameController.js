const Game=require('../models/game');
const Room=require('../models/room');

// start game
exports.startGame=async (req,res,io)=>
{
const {gameId}=req.body;

try
{
    const game=await Game.findOne({gameId});

    if(!game)
    {
        return res.status(404).send("Game not found");
    }

    if(game.status!=='waiting')
    {
        return res.status(400).send("Game is already started or ended");
    }

    game.status='started';
    await game.save();

    io.to(gameId).emit('gameStarted', { message: 'Game has started!', game });
    res.status(200).json({message:'Game started successfully',game})
}catch(error)
{
    res.status(500).send('Error starting game: '+error.message);
}
};

// end game
exports.endGame=async(req,res)=>
{
  const {gameId}=req.body;

  try{
    const game=await Game.findOne({gameId});

    if(!game)
    {
        return  res.status(404).send("Game is not found");
    }

    if(game.status!=='started')
    {
        return  res.status(400).send("Game is not in progress");
    }

    game.status="ended";
    await game.save();
    io.to(gameId).emit('gameEnded', { message: 'Game has ended', game });
    res.status(200).json({message:"Game ended successfully",game});
  }
  catch(error)
  {
    res.status(500).send("Error in ending game: "+error.message)
  }
};

// draw numbers

exports.drawNumber=async (req,res)=>
{
    const {gameId}=req.body;

    try{
      const game=await Game.findOne({gameId});
  
      if(!game)
      {
         return res.status(404).send("Game is not found");
      }
  
      if(game.status!=='started')
      {
        return  res.status(400).send("Game is not in progress");
      }

      const number=Math.floor(Math.random()*90)+1;

      if(game.drawnNumbers.includes(number))
      {
        return  res.status(400).send("Number is already drawn");
      }

      game.drawnNumbers.push(number);
      await game.save();
      
      io.to(gameId).emit('numberDrawn', { message: "Number drawn", number });
      res.status(200).json({message: "Number drawn successfully", number });
    }
    catch(error)
    {
        res.status(500).send("Error in dawing a number: "+error.message);
    }
};

// check win
exports.checkWin=async (req,res)=>
{
  const {gameId,playerId}=req.body;
   try
   {
    const game=await Game.findOne({gameId});

    if(!game)
    {
      return res.status(404).send("Game not founded");
    }
  
    if(game.status!=='started')
    {
      return res.status(400).send("Game is not in progress");
    }
  
    const playerTicket=game.tickets.find(ticket=> ticket.playerId.toString()===playerId);
  
    if(!playerTicket)
    {
      return res.status(400).send("Player not found in the game");
    }
  
    const hasWon=playerTicket.ticketNumbers.every(number=> game.drawnNumbers.includes(number));
    if(hasWon)
    {
      game.winners.push(playerId);
      await game.save();

      io.to(gameId).emit('playerWon', { message: "Player has won!", playerId });
      res.status(200).json({message:"Player has Won!",playerId});
    }
    else
    {
      io.to(gameId).emit('notAWinner', { message: 'You have not won yet.' });
      res.status(200).json({ message: "Player has not won yet." });
    }
   }
   catch(error)
   {
    res.status(500).send("Error checking win: " + error.message);
   }
};