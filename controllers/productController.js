
import { isAdmin } from "./userController.js";
import product from "../models/product.js";

export async function createProduct(req,res){

    if(!isAdmin(req)){
        res.status(403).json({message:"Access denied. Admins only."});
        return;
    }
    try{
        const existingProduct =  await product.findOne({
            productId : req.body.productId
        })

        if(existingProduct){
            res.status(400).json({message: "Product with given  productId already exists"});
            return;
        }
        
        const data = {}
        data.productId = req.body.productId;

        if(req.body.name == null){
            res.status(400).json({message: "product name is required"});
            return;
        }
        data.name = req.body.name;
        data.description  = req.body.description || ""
        data.altNames =req.body.altNames || []

        if(req.body.price == null){
            res.status(400).json({message: "Product price  is required"});
            return;
        }
        data.price = req.body.price;
        data.labelledprice = req.body.labelledprice || req.body.price
        data.category = req.body.category || ""
        data.images  = req.body.images  || [
            "/images/default-product-1.png",
            "/images/default-product-2.png",
        ];
        data.isVisible = req.body.isVisible;
        data.brand = req.body.brand || "Generic";
        data.model = req.body.model ||  "Standard";

        const newProduct =  new product(data);

        await  newProduct.save();

        res.status(201).json({message:  "product created successfully", product})


        
    }catch(error){
        res.status(500).json({ message:  "Error creating  product", error: error});

    }

}

export async function getProducts(req,res) {

    try{
        if(isAdmin(req)){
            const products = await product.find();
            res.status(200).json(products);
        }else{
            const products =  await product.find({isVisible: true});
            res.status(200).json(products);
        }
    }catch(error){
        res.status(500).json({
            massage: "Error fetching products", error: error
        });
    }
   
}
export async  function  deleteProduct(req,res){
    if(!isAdmin(req)){
        res.status(403).json({message: "Access  denied. admins only."});
        return;
    }
    try{

        const productId = req.para.productId;
        await product.deleteOne({ productId: productId});
        res.status(200).json({message: "product deleted successfully"});

    }catch(error){
        res.status(500).json({message: "Error deleting product",error: error})
    }
}

export async function updateProduct(req,res){

    if(!isAdmin(req)){
        res.status(403).json({message:"Access denied. Admins only."});
        return;
    }
    try{
        const productId = req.params.productId;

        
        const data = {}

        if(req.body.name == null){
            res.status(400).json({message: "product name is required"});
            return;
        }
        data.name = req.body.name;
        data.description  = req.body.description || ""
        data.altNames =req.body.altNames || []

        if(req.body.price == null){
            res.status(400).json({message: "Product price  is required"});
            return;
        }
        data.price = req.body.price;
        data.labelledprice = req.body.labelledprice || req.body.price
        data.category = req.body.category || ""
       // data.images  = req.body.
        data.brand = req.body.brand || "Generic"
        data.model = req.body.model ||  "Standard"

        const newProduct =  new product(data);

        await  product.updateOne({productId: productId}, data);

        res.status(201).json({message:  "product update successfully", product})


        
    }catch(error){
        res.status(500).json({ message:  "Error creating  product", error: error});

    }

}

export async function getProductById(req,res) {
    try{
        const productId = req.params.productId;
        const procuct = await product.findOne({productId: productId});

        if(procuct == null){
            res.status(404).json({message: "product not found"});
            return;
        }
        if(!procuct.isVisible){
            if(!isAdmin(req)){
                res.status(404).json({message: "product not found"});
                return;
            }

        }
        res.status(200).json(product);
    }catch(error){
        res.status(500).json({message: "Error fetching  product", error: error});
    }
    
}