const port=4000;

//initilaizing all packages
const express = require("express");
const app = express();
const mongoose = require("mongoose");
// we can generate the token and readify the token
const jwt = require("jsonwebtoken");
// we can create the image storage system
const multer = require("multer");
const path = require("path");
// accessto react project
const cors = require("cors");
const { mongoURI } = require("./config");

// whatever reuqest we get from response, it will automatically pass through json
app.use(express.json());

// our project will connect to express on 4000 port
// connect frontend with backend
app.use(cors());

//initilize database
// connection string with mongodb
mongoose.connect(mongoURI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    serverSelectionTimeoutMS: 30000});

// API Creation
app.get("/", (req, res)=>{
    res.send("Express app is Running");
})
// API to add product in database (upload folder)
// Image Storage Engine
const storage = multer.diskStorage({
    destination: './upload/images',
    // create a function to generate file name
    filename: (req, file, cb)=>{
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

// Using multer , an upload function to pass this configuration
const upload = multer({storage:storage})

// Creating Upload Endpoint for images
app.use('/images', express.static(path.join(__dirname, 'upload/images')))

app.post("/upload", upload.single('product'), (req, res)=>{
    res.json({
        success: 1,  // if image is uploaded successfuly, response success
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    })

})

// Endpoint to add product to mongoDB database
// first have to create a schema
// Schema fr Creating Product
const Product = mongoose.model("Product", {
        id: {
            type: Number,
            required: true,
        },
        name:{
            type: String,
            required: true,
        },
        image:{
            type: String,
            required: true,
        },
        category:{
            type: String,
            required: true,
        },
        new_price:{
            type: Number,
            required: true,
        },
        old_price:{
            type: Number,
            required: true,
        },
        date:{
            type: Date,
            default: Date.now,
        },
        available:{
            type: Boolean,
            default: true,
        }
})

// endpoint
app.post('/addproduct', async (req, res)=>{
    //automatic geneartion of keys. Total products ++
    let products = await Product.find({});
    let id;
    if(products.length > 0)
    {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id + 1;
    }
    else
    {
        id=1;   //incase of 0 product
    }
    const product = new Product({
        //id: req.body.id,
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
    });
    console.log(product);
    await product.save();
    console.log("Saved");

    //response for frontend, will pass an aboject with status and name of product
    res.json({
        success: true,
        name: req.body.name,

    })
})

// Creating API for deleting products
app.post('/removeproduct', async (req, res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");

    // Add response for frontend
    res.json({
        success: true,
        name: req.body.name
    });
})

// Creating API for getting all products
app.get('/allproducts', async(req, res)=>{
    let products = await Product.find({});
    console.log("All products fetched");
    res.send(products);
})


// Schema creatioon for user model
const Users = mongoose.model('Users', {
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password:{
        type: String,
    },
    cartData:{
        type: Object,
    },
    date:{
        type: Date,
        default: Date.now,
    }
})

// Creating Endpoint fr registering the user
app.post('/signup', async (req, res) => {
    let check = await Users.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false, errors:"existing user found with same email id"})
    }

    // if user does not exist
    let cart = {};
    //create empty object where we will create keys upto 300
    for (let i = 0; i < 300; i++) {
        cart[i] = 0;
    }
    // Creating new user
    const user = new Users({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData: cart,
    });

    // Save the user in database
    await user.save();

    // Create token
    const data = {
        user: {
            id:user.id
        }
    }
    const token = jwt.sign(data, 'secret_ecom');
    res.json({success:true, token})

})

// Creating Endpoint for user login
app.post('/login', async(req, res)=>{
    let user = await Users.findOne({email:req.body.email});
    if(user){
        const passCompare = req.body.password === user.password;
        if(passCompare){
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data, 'secret_ecom');
            res.json({success:true, token})
        }
        else{
            res.json({succes:false, errors:"Wrong password"})
        }
    }
    else{
        res.json({success:false, errors:"Wrong email id"})
    }
})

// Creating API for deleting all products
app.delete('/removeallproducts', async (req, res) => {
    try {
        await Product.deleteMany({});
        console.log("All products removed");

        // Add response for frontend
        res.json({
            success: true,
            message: "All products have been removed"
        });
    } catch (error) {
        console.log("Error: " + error);
        res.status(500).json({
            success: false,
            message: "Failed to remove all products"
        });
    }
});

// Creating Endpoint for newcollection data
app.get('/newcollection', async (req, res)=>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("New Collection fteched");
    res.send(newcollection);
})

// Creating Endpoint for popular in women
app.get('/popularinwomen', async (req, res)=>{
    let products = await Product.find({category:"women"});
    let popularinwomen = products.slice(0, 4);
    console.log("Popular in women Fetched");
    res.send(popularinwomen);
})

// creating middle ware to fetch user from token
    const fetchUser = async (req, res, next)=>{
        const token = req.header('auth-token');
        if(!token){
            res.status(401).send({errors:"Please authenticate using valid token"});
        }
        else{
            try {
                const data = jwt.verify(token, 'secret_ecom');
                req.user = data.user;
                next();  // our token will be decoded
            } catch (error) {
                res.status(401).send({errors:"please authenticate using a valid token"})
            }
        }
    }   
// Creating Endpoint for adding products in cartdata
app.post('/addtocart', fetchUser, async (req, res)=>{
    console.log(req.body.itemId);
    // data of a user
    let userData  =await Users.findOne({_id: req.user.id});

    //modify the cart data
    userData.cartData[req.body.itemId] += 1;

    //save in mongodb
    await Users.findOneAndUpdate({_id:req.user.id}, {cartData:userData.cartData});
    
    // send JSON response
    res.send({success:true, message: "Added"});
});

// Creating endpont to remove product from cart data
app.post('/removefromcart', fetchUser, async (req, res)=>{
    console.log("removed", req.body.itemId);
    // data of a user
    let userData  = await Users.findOne({_id: req.user.id});

    if(userData.cartData[req.body.itemId] > 0)
    //modify the cart data
    userData.cartData[req.body.itemId] -= 1;

    //save in mongodb
    await Users.findOneAndUpdate({_id:req.user.id}, {cartData:userData.cartData});
    
    // send JSON response
    res.send({success:true, message: "REmoved"});

});

// creating endpoint ot get cartdata
app.post('/getcart', fetchUser, async (req, res)=>{
    console.log("cartData");
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
})


app.listen(port,(error)=>{
    if(!error){
        console.log("Server running on Port "+port);
    }
    else{
        console.log("Error: "+error);
    }
})