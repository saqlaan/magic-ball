const Game = require('../models/game.model');

const GameService = {
  create: async (gameData) => {
    return new Game(gameData).save();
  },
  findById: async (_id) => {
    return Game.findById(_id );
  },
  findByCode: async (gameCode) => {
    return Game.findOne({gameCode}).populate({ path: 'players.user', select:'firstName lastName email' })
  },
  update: async (_id, gameData) => {
    return Game.findOneAndUpdate({_id}, {
      ...gameData,
    },{
      new: true
    });
  },
  updateRound: async (_id, gameData) => {
    if(gameData.round){
      return Game.findOneAndUpdate({_id, 'rounds._id': gameData.round.roundId}, {
        ...gameData,
        $set: getRoundKeyValue()
      },{
        new: true
      });
    } else {
      return await GameService.update(_id, gameData);
    }
    function getRoundKeyValue() {
      const object = {};
      Object.keys(gameData.round.roundData).forEach(key => {
        object['rounds.$.'+ key] = gameData.round.roundData[key]
      })
      return object;
    }
  },
  addRound: async (_id, gameData) => {
    return Game.findOneAndUpdate({_id}, {
      "currentRound": gameData.currentRound,
      $push: {rounds: gameData.roundData}
    }, {new: true});
  },
  addPlayer: async (_id, playerData) => {
    return Game.findOneAndUpdate({_id}, {
      $push: {players: playerData}
    },{
      new: true
    })
  },
  addViewer: async (gameCode, viewerData) => {
    return Game.findOneAndUpdate({gameCode}, {
      $push: {viewers: viewerData}
    },{
      new: true
    })
  },
}
module.exports = GameService;
