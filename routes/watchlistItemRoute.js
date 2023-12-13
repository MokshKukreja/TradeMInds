const express = require("express")
const watchlistRouter = express.Router()
const {createWatchlist, getWatchlist, deleteWatchlist, checkWatchList} = require("../controllers/watchlistController")
const auth = require("../middleware/auth")

watchlistRouter.post("/",auth,createWatchlist)
watchlistRouter.get("/",auth,getWatchlist)
watchlistRouter.get("/:name",auth,checkWatchList)
watchlistRouter.delete("/:name",auth,deleteWatchlist)

module.exports = watchlistRouter