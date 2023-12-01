import { Router, Request, Response } from "express";
import Logger from "../resources/logger";
import dotenv from "dotenv";
import path from "path";
import {
	authChangeemailValidation,
	authJWTValidation,
	authSendemailValidation,
	authVerifyemailValidation,
	webCustomerValidation,
} from "../middleware/authValidations";
import { validate } from "../middleware/handleValidation";
import {
	createJWT,
	sendEmailVerify,
	receiveEmailVerify,
	sendEmailPassw,
	receiveChangePassw,
} from "../controllers/authController";
import { __basedir } from "../node";
import { createWebUser } from "../controllers/userControllers";
//---- Routes propriamente ditas -------------------------------------
const openRoutes = Router();
dotenv.config();
const jwt_secret = process.env.JWT_SECRET;
const BACKEND_URL = process.env.BACKEND_URL;
const appOrigin = process.env.APP_ORIGIN;

export default openRoutes

	.get("/n", (req, res) => {
		res.sendFile(path.join(__basedir + "/public/node.html"));
	})
	.get("/i", (req, res) => {
		res.sendFile(path.join(__basedir + "/public/index.html"));
	})
	.get("/overview", (req: Request, res: Response) => {
		const dataHoraAtual = new Date();
		// Formata a data e hora atual como uma string
		const dataHoraFormatada = dataHoraAtual.toLocaleString();
		// Cria a mensagem de resposta incluindo a data e hora
		const mensagem = `We are here! Data e hora atual: ${dataHoraFormatada}`;
		// Envia a mensagem como resposta
		const overview = `We are here! APP_ORIGIN: ${appOrigin}`;
		res
			.status(201)
			.send({ msg: mensagem, overview: overview, backend: BACKEND_URL });
	})
	//.post("/api/webuser", webCustomerValidation(), validate, createWebUser)
	.post("/api/login", authJWTValidation(), validate, createJWT)
	//.post("/api/signup", createWebUser)
	.post(
		"/api/sendverifyemail",
		authSendemailValidation(),
		validate,
		sendEmailVerify
	)
	.get(
		"/api/verifyemail",
		authVerifyemailValidation(),
		validate,
		receiveEmailVerify
	)
	.post(
		"/api/sendchangepassemail",
		authSendemailValidation(),
		validate,
		sendEmailPassw
	)
	.get("/changePass", (req, res) => {
		res.sendFile(path.join(__basedir + "/public/ChangePass/index.html"));
	})
	.post(
		"/api/changepassword",
		authChangeemailValidation(),
		validate,
		receiveChangePassw
	);

// Middleware para lidar com rotas não encontradas
// openRoutes.use((req, res) => {
// 	res.status(404).json({ message: "Open Route não encontrada" });
// });
