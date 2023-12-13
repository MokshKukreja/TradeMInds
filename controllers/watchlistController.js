const Watchlist = require("../models/watchlistItem");
const { param } = require("../routes/watchlistItemRoute");
const createWatchlist = async (req, res) => {
    try {
        const existingItem = await Watchlist.findOne({ name: req.body.name });
        if (existingItem) {
            return res.status(400).json({ message: "Item with the same name already exists" });
        }
        const watchItem = new Watchlist({
            name: req.body.name,
            userId: req.userId
        });

        const savedItem = await watchItem.save();
        res.json(savedItem);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
};

const getWatchlist = async (req,res)=>{
    try {
        const watchItems = await Watchlist.find({userId: req.userId});
        const names = watchItems.map(item => item.name);
        res.json(names);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
}
const deleteWatchlist = async (req, res) => {
    try {
        const name = req.params.name;
        const id = req.params.id;
        let watchlist = await Watchlist.findOne({ name: name });
        if (!watchlist) { 
            return res.status(404).send("Not Found");
        }
        watchlist = await Watchlist.findOneAndDelete({ name: name });
        res.json({ "Success": "watchlist has been deleted", watchlist: watchlist });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
}

const checkWatchList = async (req, res) => {
    try {
      const name = req.params.name;
      const id = req.params.id;
      const existingItem = await Watchlist.findOne({name:name});
      if (existingItem) {
        res.send(true);
      } else {
        res.send(false);
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Error while checking watchlist");
    }
  };

module.exports = {
    createWatchlist,
    getWatchlist,
    deleteWatchlist,
    checkWatchList
}