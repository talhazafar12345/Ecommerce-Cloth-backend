

const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const app = express()
app.use(cors())
app.use(express.json())
mongoose.connect("mongodb+srv://talha241996_db_user:mhkmD26X68rFchEQ@cluster0.2zmeniw.mongodb.net/?appName=Cluster0")
.then(()=>{
console.log("MongoDB is connected")
}).catch(()=>{
console.log("MongoDB is not connected")
})
const orderSchema= new mongoose.Schema({

orderNumber:String,
name:String,
email:String,
whatsapp:String,
address:String,

cart:[{
id:String,
image:String,
name:String,
newPrice:Number,
quantity:Number,
}],
totalPrice:String,
})

const Data = mongoose.model("Data",orderSchema)
app.post("/submit-data",async(req,res)=>{
try{
const {orderData} = req.body
const orderNumber = "ORD-" + Date.now() + "-" + Math.floor(1000 + Math.random() * 9000)
const getData = new Data({...orderData,orderNumber})
const response = getData.save()
console.log(response)
res.status(200).json({success:true,message:"Order received successfully",orderNumber:orderNumber})
}

catch(error){
console.log(error)
res.status(400).json({succrss:true,message:"Error"})
}
})



const Port = process.env.PORT || 5000
app.listen(Port,()=>{
console.log(`Server is running on Port ${Port}`)
})