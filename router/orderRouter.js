import express from "express";
import { createOrder, getOrders, updateeOrderStatusAndNotes } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/",createOrder)
orderRouter.get("/:pageSize/:pageNumber", getOrders)
orderRouter.put("/:orderId", updateeOrderStatusAndNotes)

export default orderRouter;