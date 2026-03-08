import express from "express"
import { createProduct, deletProduct, getProducts } from "../controllers/productController.js";

const productRouter = express.Router();
productRouter.post('/',createProduct);
productRouter.get("/",getProducts);
productRouter.delete("/",deletProduct);

export default productRouter;