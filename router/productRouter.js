import express from "express"
import { createProduct, deleteProduct,getProducts, updateProduct,getProductById, searchProducts} from "../controllers/productController.js";

const productRouter = express.Router();
productRouter.post("/",createProduct);
productRouter.get("/",getProducts);
productRouter.get("/search/:query", searchProducts);
productRouter.delete("/:productId",deleteProduct);
productRouter.put("/:productId",updateProduct)
productRouter.get("/:productId",getProductById)


export default productRouter;