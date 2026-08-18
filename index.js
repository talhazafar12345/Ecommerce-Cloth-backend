

const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const app = express()
const multer = require("multer");

app.use(cors())
app.use(express.json())
app.use("/uploads", express.static("uploads"))

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

const adminSchema = new mongoose.Schema({
email:String,
password:String,
})

const CategorySchema= new mongoose.Schema({
category:String,
image:String,
status:String,

})








const Data = mongoose.model("Data",orderSchema)
const Admin = mongoose.model("Admin",adminSchema)
const Category = mongoose.model("Category",CategorySchema)

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

app.post("/admin-data",async(req,res)=>{

try{
const {form} = req.body

const existing = await Admin.findOne({
email:form.email,
password:form.password
})
if(existing){
res.status(200).json({success:true,message:"Go to dashboard"})
return
}
else{
res.status(400).json({success:false,message:"only for admins"})
return
}
const getData = new Admin({...form})
const response = getData.save()
console.log(response)
res.status(200).json({success:true,message:"Data saved successfully"})
}
catch(error){
console.log(error)
res.status(400).json({success:true,message:"Error"})

}
})


app.post("/change-password",async(req,res)=>{

try{
const {email,newPassword,confirmPassword} = req.body
const user = await Admin.findOne ({email})

if(!user){
return res.status(400).json({success:false,message:"Details not found"})
}
if(!newPassword || !confirmPassword){
return res.status(400).json({success:false,message:"Please enter passwords"})
}
if(newPassword !== confirmPassword){
return res.status(400).json({success:false,message:"Passwords are mot match"})
}
user.password = newPassword
await user.save()
res.status(200).json({success:true,message:"Password change successfully"})
}
catch(error){
console.log(error)
res.status(400).json({success:false,message:"Error"})
}
})


app.post("/categories",async(req,res)=>{
try{
const {newCategory} = req.body
const getData = new Category({...newCategory})
const response = await getData.save()
console.log(response)
res.status(200).json({success:true,message:"Category saved successfully",response})
}
catch(error){
console.log(error)
res.status(400).json({success:false,messaage:"Error"})
}
})


app.put("/categories/:id",async(req,res)=>{

try{
const {status} = req.body
const getData = await Category.findByIdAndUpdate(
req.params.id,{
status:status,
},
{
new:true
}
)
res.status(200).json({success:true,message:"Status change successfully"})
}

catch(error){
console.log(error)
res.status(400).json({success:false,message:"Error"})
}})


app.get("/categories/all",async(req,res)=>{

try{
 const response = await Category.find()
 console.log(response)
 res.status(200).json({success:true,data:response})

}
catch(error){
res.status(400).json({success:false,message:"Error"})
}
})

app.get("/categories",async(req,res)=>{

try{
const getData = await Category.find({
status:"Active",
})
res.status(200).json({success:true,data:getData})
}

catch(error){
console.log(error)
res.status(400).json({success:false,message:"Error"})
}







})


app.put("/categor/:id",async(req,res)=>{

try{
const getData = await Category.findByIdAndUpdate(
req.params.id,{
category:req.body.category,
image:req.body.image,
}
)
res.status(200).json({success:true,message:"Category edit successfully",data:getData})
}

catch(error){
console.log(error)
res.status(400).json({success:true,message:"Error"})
}
})


app.delete("/cate/:id",async(req,res)=>{
try{
const getData= await Category.findByIdAndDelete(
req.params.id
)
res.status(200).json({success:true,message:"Category deleted successfully"})
}

catch(error){
console.log(error)
res.status(400).kson({success:false,message:"Error"})
}
})

const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, "uploads/")
   },
   filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname)
   }
})

const upload = multer({
   storage: storage
})
app.post("/upload", upload.array("image",10), (req,res)=>{
try{
if(!req.files || req.files.length===0){
return res.status(400).json({success:false,message:"images not uploaded"})
}
const images = req.files.map((file)=>{
return `http://localhost:5000/uploads/${file.filename}`
})
res.status(200).json({success:true,message:"images uploaded successfully",image:images})
}
catch(error){
console.log(error)
res.status(400).json({success:false,message:"Error"})
}
})



















const Port = process.env.PORT || 5000
app.listen(Port,()=>{
console.log(`Server is running on Port ${Port}`)
})