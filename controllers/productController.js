import { isAdmin } from "./userController.js";
import product from "../models/product.js";

export async function createProduct(req,res){
    if(isAdmin(req)){
        res.stetus(401).json({message:"Access denied. Admin only."});
        return;
    }

    try{

        const existingProduct = await product.findOne({
            productId : req.body.productId
        });

        if(existingProduct){
            res.status(400).json({message : "roduct with given productId already exists"});
            return;
        }
        const data = {};
        data.productId = req.body.productId;

        if(req.body.name == null){{
            res.status(400).json({message : "product name is required"});
            return;
        }
        data.name = req.body.name;
        data.description = req.body.description || "";
        data.altName = req.body.altName || [];


        if(req.body.price == null){
            res.status(400).json({
                message : "product pris is required"});
            return;
        }
        data.price = req.body.price;
        data.lebelledPrice = req.body.labellePrice || req.body.price;
        data.catogory = req.body.catogory || "others";
        data.images = req.body.images || [
            "/images/defoult_prodict_1.png",
            "/images/defoult_product_2.png",
        ];
        data.isVisible = req.body.isVisible;
        data.brand = req.body.brand || "generic";
        data.model = req.body.model || "standard";

        const newProduct = new product(data);

        await newProduct.save();

        res
            .status(200)
            .json({message : "Product created successfully", product : newProduct});
    }

    }catch(error){
        res.status(500).json({message: "Error creating product", error : error});
    }
}

export async function getProducts(req,res){
    try{
        if(isAdmin(req)){
            const products = await product.find();
            res.status(200).json(product);
        }else{
            const products = await product.find({ isVisible : true});
            res.status(200).json(products);
        }


    }catch(error){
        res.status(500).json({message : "error fetchig product"})
    }
}

export async function deletProduct(req,res){
    if(isAdminr(req)){
        res.status(403).json({message : "Acces denied. admins only."});
        return;
    }
    try{
        const product = req.body.productId;
        await product.deleteOne({productId : productId});
        res.status(200).json({massage: "Product deleted successfully"});

    }catch(error){
        res.status(500).json({message : "Eroor deleting product", error:error});

    }

}

export async function updateProduct(req, res){
    if(!isAdmin(req)){
        res.status(403).json({message : "Access denied. Admins only."});
        return;
    }

    try{
        const productId = req.params.productId;

        const data = {};

        if (req.body.name == null){
            res.status(400).json({message : "product name is required"});
            return;
        }
		data.price = req.body.price;
		data.labelledPrice = req.body.labelledPrice || req.body.price;
		data.category = req.body.category || "Others";
		data.images = req.body.images || [
			"/images/default-product-1.png",
			"/images/default-product-2.png",
		];
		data.isVisible = req.body.isVisible;
		data.brand = req.body.brand || "Generic";
		data.model = req.body.model || "Standard";

        await product.updateOne({ productId: productId},data);

        res
            .status(201)
            .json({message: "product updated successfully"});
    }catch (error){
        res.status(500).json({ message: "Error updating product", error: error });
    }
}

export async function getProductById(req , res) {
    console.log("Get product by id api called")
    try{
        const productId= req.params.productId;
        const product = await product.findOne({productId : productId});

        if(product == null){
            res.status(404).json({message : "product not found"});
            return;
        }
        if(!product.isVisible){
            if(!isAdmin(req)){
                res.status(404).json({message:"product not found."})
                return;
            }
        }
        res.status(200).json(product);

    }catch(error){
        res.status(500).json({message : "Error fetching product", error : error});

    }

}
    export async function searchProducts(req, res) {
    }
