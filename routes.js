import { Router } from "https://deno.land/x/oak/mod.ts";
import db from './db/database.js';

const getAllProducts = async ({ response }) => {
	response.body = await db.query("SELECT * FROM products ORDER BY id");
};

const router = new Router();

router.get("/", (response) => {
	response.json({success: true});
})

router.get("/products", getAllProducts)

export default router;
