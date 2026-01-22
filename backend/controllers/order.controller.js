import Order from "../models/order.model.js";

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user?._id;

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "products.product",
        select: "name image category",
      });

    return res.status(200).json({ orders });
  } catch (error) {
    console.log("Error in getMyOrders controller", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
