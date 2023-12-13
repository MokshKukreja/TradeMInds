const express = require('express');
const path = require('path');
const watchlistRouter = require("./routes/watchlistItemRoute")
const userRouter = require("./routes/userRoutes")
const mongoose = require("mongoose")
const cors = require("cors")
const app = express();



app.use(express.json())
app.use(cors())
app.use((req,res,next)=>{
  console.log("HTTPS Method" + req.method + " , URL" +req.url)
  next();
})
app.use("/watchlist",watchlistRouter)
app.use("/users",userRouter)

const uri = 'mongodb://localhost:27017/trade';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log('Error connecting to MongoDB', err));
mongoose.set('strictQuery', true);


app.get("/",(req,res)=>{
  res.sendFile(path.join(__dirname, "public", "login.html"));
});
app.use(express.static(path.join(__dirname, 'public')));
app.get("/home",(req,res)=>{
  res.sendFile(path.join(__dirname, "public", "index.html"));
});








const port = process.env.PORT || 2000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
// const express = require('express');
// const path = require('path');
// const watchlistRouter = require('./routes/watchlistItemRoute');
// const userRouter = require('./routes/userRoutes');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const app = express();

// app.use(express.json());

// // Enable CORS
// app.use(cors({ origin: 'http://localhost:2000' }));

// app.use((req, res, next) => {
//   console.log('HTTPS Method' + req.method + ' , URL' + req.url);
//   next();
// });

// app.use('/watchlist', watchlistRouter);
// app.use('/users', userRouter);

// const uri = 'mongodb://localhost:27017/trade';

// mongoose
//   .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((err) => console.log('Error connecting to MongoDB', err));

// mongoose.set('strictQuery', true);

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'login.html'));
// });

// app.use(express.static(path.join(__dirname, 'public')));

// app.get('/home', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// const port = process.env.PORT || 2000;
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
