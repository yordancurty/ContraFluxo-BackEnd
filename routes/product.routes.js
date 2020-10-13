const router = require("express").Router();
const passport = require("passport");
const uploader = require("../configs/cloudinary.config");

//const { ObjectId } = require("mongoose").Types;

const Product = require("../models/Product.model");


//Rotas dos produtos:

//Read:

router.get("/product", async (req, res) => {
    try{

        const result = await Product.find();

        return res.status(200).json(result);

    } catch(err){
        return res.status(500).json({error: err})
    }
});

//Create:

router.post("/product", passport.authenticate("jwt", {session: false}), async (req, res) => {
    try{
        
    const result = await Product.create(req.body);

    console.log(result);
    
    return res.status(201).json({created: result});

    } catch(err){
        return res.status(500).json({error: err})
    }
});


//Update:

router.patch("/product/:id", passport.authenticate("jwt", {session: false}), async (req, res) => {
    try{

    const { id } = req.params;
    
    const result = await Product.findOneAndUpdate({_id: id}, req.body, {new: true});

    console.log(result);

    return res.status(200).json(result);

    } catch(err){
        return res.status(500).json({error: err});
    }
});

//Rota upload de arquivo:

router.post("/attachment-upload", uploader.single("attachment"), (req, res) => {
    if (!req.file){
        return res.status(500).json({message: "Nenhum arquivo carregado!"});
    }

    return res.status(200).json({attachmentUrl: req.file.secure_url})
})

//Delete:

router.delete("/product/:id", passport.authenticate("jwt", {session: false}), async (req, res) => {
    try {

    const { id } = req.params;
    
    const result = await Product.deleteOne({_id: id});

    console.log(result);

    return res.status(200).json({});

    } catch(err){
        return res.status(500).json({message: "Internal server error"});
    }
});


module.exports = router;