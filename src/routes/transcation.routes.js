const {Router} = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const transcationRoutes = Router();




// post/api/transactions
//creating a  new transcation

transcationRoutes.post("/",authMiddleware.authMiddleware);

module.exports = transcationRoutes;