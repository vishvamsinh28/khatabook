const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');

app.set('views', path.join(__dirname, 'views')); 
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/khatabook", {
  useNewUrlParser: "true",
})
mongoose.connection.on("error", err => {
  console.log("err", err)
})
mongoose.connection.on("connected", (err, res) => {
  console.log("mongoose is connected")
})

const dataschema = mongoose.Schema({name:String , amount : Number , paymentStatus : String , borrowdate : Date})
const data = mongoose.model("data" , dataschema);

app.get("/",async (req,res)=>{
    const users = await data.find();
    res.render('home.ejs',{users})
})

app.get('/add_data',(req,res)=>{
    res.render("add_data.ejs");
})

app.post('/add_data',async (req,res)=>{
  await data.insertMany({name:req.body.name,amount:req.body.amount,paymentStatus:"pending",borrowdate:req.body.date});
  res.redirect('/');
})

app.get("/show_pending",async(req,res)=>{
  const users = await data.find();
  res.render('show_pending.ejs',{users});
})

app.get("/show_paid",async(req,res)=>{
  const users = await data.find();
  res.render('show_paid.ejs',{users});
})

app.get("/clear_paid",async(req,res)=>{
  await data.deleteMany({paymentStatus:"paid"});
  res.redirect("/");
})

app.get("/topaid/:id",async(req,res)=>{
  const id = req.params.id;
  await data.findByIdAndUpdate(id,{paymentStatus:"paid"});
  res.redirect('/');
})

app.listen(3000,()=>{
    console.log("we are listening on port 3000");
});