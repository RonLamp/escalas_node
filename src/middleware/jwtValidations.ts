import { header, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import IJWTPayload from "../interfaces/jwtPayload";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import Logger from "../resources/logger";
dotenv.config();
const prisma = new PrismaClient();

// Função para validar o token JWT que vem no cabeçalho da requisição
export const validateJWT = (headerName: string) => {
	return [
		// Verifica se o cabeçalho existe
		header(headerName)
			.notEmpty()
			.withMessage(`O cabeçalho ${headerName} não deve estar vazio`)
			.custom(async (value) => {
				// Verifica se o valor do cabeçalho começa com "Bearer "
				if (!value.startsWith("Bearer ")) {
					Logger.error(`O cabeçalho ${headerName} deve começar com "Bearer "`);
					throw new Error(`O cabeçalho ${headerName} deve ser um token JWT`);
				}
				// Extrai o token da string "Bearer "
				const token = value.split(" ")[1];
				const secretKey = process.env.JWT_SECRET as string;
				// decode de token para conseguirmos o email
				const { email } = jwt.decode(token) as IJWTPayload;
				const saltdb = await getSaltFromUser(email);
				// verify jwt para verificarmos se o token é valido e qual a sua expiração
				const decodedToken = jwt.verify(
					token,
					secretKey + saltdb
				) as IJWTPayload;
				if (!decodedToken.verified) {
					Logger.error(`O email ${email} não foi verificado`);
					throw new Error("Email não verificado");
				}
				if (decodedToken.exp && decodedToken.exp > Date.now()) {
					Logger.error(`O token JWT do email ${email} expirou`);
					throw new Error("Token JWT expirado");
				}
				return true;
			}),

		// Verifica os erros de validação do express-validator
		(req: Request, res: Response, next: NextFunction) => {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(401).json({ msg: "Unauthorized" });
			}
			next();
		},
	];
};

// ----- Funções Auxiliares ------------------------------------------
// Função para obter salt do usuário do banco de dados
async function getSaltFromUser(email: string) {
	const user = await prisma.user.findFirst({
		where: {
			email: email,
		},
	});
	if (!user) {
		throw new Error("Usuário não encontrado");
	} else {
		return user?.salt;
	}
}
