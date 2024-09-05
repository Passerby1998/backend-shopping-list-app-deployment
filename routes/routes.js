import { Router } from "express";
import healthController from "../controllers/health.js";
import authController from "../controllers/auth.js";
import privacyController from "../controllers/privacy.js";
import isAuth from "../middlewares/isAuth.js";
import createGrTrip from "../controllers/shTrip/trCreate.js";
import listGrTrip from "../controllers/shTrip/trList.js";
import viewGrTrip from "../controllers/shTrip/trView.js";
import updateGrTrip from "../controllers/shTrip/trUpdate.js";
import deleteGrTrip from "../controllers/shTrip/trDelete.js";
import isValid from "../middlewares/isValid.js";
import createItem from "../controllers/items/create.js";
import listItems from "../controllers/items/list.js";
import viewItem from "../controllers/items/view.js";
import updateItem from "../controllers/items/update.js";
import deleteItem from "../controllers/items/delete.js";

const router = Router();

router.get("/", healthController.getHealth);
router.post("/", healthController.postHealth);
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.get("/public", privacyController.publicPath);
router.get("/private", isAuth, privacyController.privatePath);

//nested routes
router.post("/grocerytrip", isAuth, createGrTrip);
router.get("/grocerytrip", isAuth, listGrTrip);
router.get("/grocerytrip/:id", isAuth, viewGrTrip);
router.put("/grocerytrip/:id", isAuth, updateGrTrip);
router.delete("/grocerytrip/:id", isAuth, deleteGrTrip);

router.post("/items", isAuth, isValid, createItem);
router.get("/items", isAuth, isValid, listItems);
router.get("/items/:id", isAuth, isValid, viewItem);
router.put("/items/:id", isAuth, isValid, updateItem);
router.delete("/items/:id", isAuth, isValid, deleteItem);

export default router;
