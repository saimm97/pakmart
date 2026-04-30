import { Router, type IRouter } from "express";
import healthRouter from "./health";
import homeRouter from "./home";
import categoriesRouter from "./categories";
import brandsRouter from "./brands";
import productsRouter from "./products";
import dealsRouter from "./deals";
import testimonialsRouter from "./testimonials";
import cartRouter from "./cart";
import ordersRouter from "./orders";
import paymentsRouter from "./payments";

const router: IRouter = Router();

router.use(healthRouter);
router.use(homeRouter);
router.use(categoriesRouter);
router.use(brandsRouter);
router.use(productsRouter);
router.use(dealsRouter);
router.use(testimonialsRouter);
router.use(cartRouter);
router.use(paymentsRouter);
router.use(ordersRouter);

export default router;
