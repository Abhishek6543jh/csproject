import express from "express";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";
const port =3000;
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
// Replace the uri string with your connection string.
const uri = "mongodb+srv://abhishek24:Abhishek20@abh.sr77f7j.mongodb.net/";
const client = new MongoClient(uri);
//k

//function that performs after posting data with regester page
async function uploadtodb(req,res) {
    try {
      const database = client.db('details');
      await client.connect();

      await createListing(client,{
          username :req.body["username"],
          email : req.body["email"],
          password:req.body["password"]
      });
    
          async function createListing(client, newListing){
              const result = await client.db("details").collection("userdaaata").insertOne(newListing);
              console.log(`New listing created with the following id: ${result.insertedId}`);
          }
  
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }

//ended


//function that validate user with login page details
async function userdbauth(user,pass,req,res) {
    try {
      const database = client.db('details');
      await client.connect();

      await finduser(client,user,pass);

    async function finduser(client,username,password){
      const result=await client.db("details").collection("userdaaata").findOne({username:username,password:password});
      if (result){
        console.log("found");
        res.redirect("/");
      }
      else{
        console.log("not found");
        res.redirect("/login");
      }
    }
         
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
//ended

app.get("/",(req,res)=>{
    res.render("index.ejs");
});
app.get("/regester",(req,res)=>{
    res.render("regester.ejs");
});
app.get("/login",(req,res)=>{
    res.render("login.ejs");
})
app.post("/login/auth",(req,res)=>{
   const user = req.body["username"];
   const pass= req.body["password"];
   userdbauth(user,pass,req,res); 
});
app.post("/regester/reg",(req,res)=>{

      uploadtodb(req,res).catch(console.dir);
      res.redirect("/login");
});
app.listen(port,(req,res)=>{
    console.log("server is listening");
});