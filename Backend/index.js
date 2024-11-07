const express=require('express')
const app=express();
app.get("/",(req,res)=>{
    res.send("Server Working")
})
app.listen(8800,()=>{
    console.log('Server is running on port 8800');
})