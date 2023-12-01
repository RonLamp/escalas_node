import { Request, Response } from "express";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Logger from "../resources/logger";
import prisma from "../resources/prisma";
import dotenv from "dotenv";
import IJWTPayload from "../interfaces/jwtPayload";

//const prisma = new PrismaClient();
dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env

const host: string = process.env.MAIL_HOST as string;
const user: string = process.env.MAIL_USERNAME as string;
const passw: string = process.env.MAIL_PASSWORD as string;
const port: string = process.env.MAIL_PORT as string;
const uri: string = process.env.BACKEND_URL as string;
const secret: string = process.env.JWT_SECRET as string;
//const appOrigin: string = process.env.APP_ORIGIN as string;

export async function getNull(req: Request, res: Response) {
	//console.log("get null");
	//console.log("Headers:", req.headers);
	return res.status(200).send({ msg: "Token válido" });
}

export async function createJWT(req: Request, res: Response) {
	//console.log(`email: ${req.body.email}`);
	//console.log(`password: ${req.body.password}`);
	try {
		const { email, password } = req.body;
		const user = await prisma.user.findFirst({
			where: {
				email: email,
			},
		});
		if (user) {
			const passwordDB = user.password;
			const saltDB = user.salt as string;
			const hashedPassw = crypto
				.createHash("sha512")
				.update(password + saltDB)
				.digest("hex");
			if (passwordDB === hashedPassw) {
				const userInfo: IJWTPayload = {
					name: user.name,
					email: email,
					avatar_url: user.avatar,
					level: user.level,
					verified: user.emailVerified,
				};
				const saltDB = user.salt as string;
				const token = jwt.sign(userInfo, secret + saltDB, { expiresIn: "4h" });
				// Em produção, retirar o userInfo do response
				// res.status(200).send({ token: token});
				res.status(200).send({ token: token, userInfo: userInfo });
			} else {
				Logger.error(`Validação do Hashed Password falhou.`);
				res.status(400).send({ error: { msg: "Email ou Password fail!" } });
			}
		} else {
			Logger.error(`Email Inexistente!!`);
			res.status(400).send({ error: { msg: "Email ou Password fail!" } });
		}
	} catch (e: any) {
		Logger.error(`Erro no sistema ${e.message}`);
		return res.status(400).json({ error: e.message });
	}
}

export async function sendEmailVerify(req: Request, res: Response) {
	try {
		//console.log(`We are here...15/09 in ${new Date().toISOString()}`);
		//console.log(`backend_url: ${uri}`);

		const { email } = req.body;
		const ifExist = await prisma.user.findFirst({
			where: {
				email: email,
			},
		});
		const saltDB = ifExist?.salt as string;

		if (ifExist) {
			// Mandar o e-mail para verificação
			const transporter = nodemailer.createTransport({
				host: host,
				port: parseInt(port),
				secure: false,
				auth: {
					user: user,
					pass: passw,
				},
			});
			//const auth = crypto.randomBytes(10).toString("hex").slice(0, 20);
			const token = jwt.sign({ email: email }, secret + saltDB, {
				expiresIn: "5m",
			});
			const html =
				`<b>Clique no link para verificarmos o email!!  </b>` +
				`<a href="${uri}/api/verifyemail?p=${token}">Link para verificação de e-mail</a>`;
			const mailOptions = {
				from: user,
				to: email,
				subject: "Verificação de e-mail",
				text: "Aqui o conteúdo do e-mail ",
				html: html,
			};
			// Enviar o e-mail propriamente dito
			//console.log("We are here...14/09");

			transporter.sendMail(mailOptions, function (error, info) {
				if (error) {
					res.status(404).send({ msg: "Erro no envio do e-mail" });
					console.log(error);
				} else {
					res.status(200).send({ msg: "E-mail enviado", info: info.response });
				}
			});
		} else {
			Logger.error(`Email Inexistente!!`);
			res.status(400).send({ error: { msg: "Email Not Found!" } });
		}
	} catch (e: any) {
		Logger.error(`Erro no sistema ${e.message}`);
		return res.status(400).json({ error: e.message });
	}
}

type IToken = {
	email: string;
	iat: number;
	exp: number;
};

export async function receiveEmailVerify(req: Request, res: Response) {
	const { email } = jwt.decode(req.query.p as string) as IToken;
	const ifExist = await prisma.user.findFirst({
		where: {
			email: email,
		},
	});
	if (ifExist) {
		const salt = ifExist?.salt as string;
		const token = req.query.p as string;
		try {
			jwt.verify(token, secret + salt);
			await prisma.user.update({
				where: {
					email: email,
				},
				data: {
					emailVerified: true,
				},
			});
			return res.status(200).send({ msg: "Email verificado com sucesso!" });
		} catch (error) {
			Logger.error("Tentativa de request com wrong token");
			return res
				.status(401)
				.send({ msg: "Tentativa de request com wrong token!!!" });
		}
	} else {
		Logger.error("Update de verified email falhou!");
		return res
			.status(401)
			.send({ msg: "Tentativa de request com wrong token!" });
	}
}

export async function sendEmailPassw(req: Request, res: Response) {
	try {
		const { email } = req.body;
		const ifExist = await prisma.user.findFirst({
			where: {
				email: email,
			},
		});
		const salt = ifExist?.salt as string;
		if (ifExist) {
			const isVerified = ifExist?.emailVerified as boolean;
			if (!isVerified) {
				res.status(401).send({ msg: "Email não verificado!!!" });
				Logger.error("Tentativa de request com email não verificado!!!");
				return null;
			}

			const transporter = nodemailer.createTransport({
				host: host,
				port: parseInt(port),
				secure: false,
				auth: {
					user: user,
					pass: passw,
				},
			});
			const token = jwt.sign({ email: email }, secret + salt, {
				expiresIn: "5m",
			});
			const html = `<b>Agenda Server!!  </b><a href="${uri}/ChangePass/index.html?p=${token}">Link para redefinição de senha</a>`;
			//const html = `<b>Agenda Server!!  </b><a href="${uri}/s">Link para redefinição de senha</a>`;
			const mailOptions = {
				from: user,
				to: email,
				subject: "Troca de senha",
				text: "Aqui a senha que queremos",
				html: html,
			};
			transporter.sendMail(mailOptions, function (error, info) {
				if (error) {
					res.status(404).send({ msg: "Erro no envio do e-mail" });
					Logger.error(`Erro no envio do e-mail ${error}`);
				} else {
					res.status(200).send({ msg: "E-mail enviado", info: info.response });
					alert("E-mail para troca de senha enviado");
				}
			});
		} else {
			Logger.error(`Email Inexistente!!`);
			return res.status(400).send({ error: { msg: "Email Not Found!" } });
		}
	} catch (e: any) {
		Logger.error(`Erro no sistema ${e.message}`);
		return res
			.status(401)
			.send({ msg: "Tentativa de request com wrong token!" });
	}
}

type IChangePassw = {
	passw: string;
};

export async function receiveChangePassw(req: Request, res: Response) {
	const { passw } = req.body as IChangePassw;
	try {
		const authorization = req.headers.authorization;
		if (!authorization) {
			res.status(401).send({ msg: "Tentativa de request sem token!!!" });
			Logger.error("Tentativa de request sem token");
			return null;
		}
		const token = String(authorization?.replace("Bearer", "").trim()) as string;
		const { email } = jwt.decode(token as string) as IToken;
		const ifExist = await prisma.user.findFirst({
			where: {
				email: email,
			},
		});
		const salt = ifExist?.salt as string;
		if (ifExist) {
			try {
				const data = jwt.verify(token, secret + salt) as IToken;
				// gerar o novo hashedPass
				const hashedPassw = crypto
					.createHash("sha512")
					.update(passw + salt)
					.digest("hex");
				// salvar na base de dados o novo hashedpassword
				await prisma.user.update({
					where: {
						email: email,
					},
					data: {
						password: hashedPassw,
					},
				});
				console.log("Senha atualizada com sucesso!");
				return res.status(200).send({ msg: "Senha atualizada com sucesso!" });
			} catch (error) {
				Logger.error("Tentativa de request com email invalido - DANGER");
				return res.status(401).send({ msg: "Falha no Servidor!!!" });
			}
		} else {
			Logger.error("Tentativa de request com email invalido");
			return res
				.status(401)
				.send({ msg: "Tentativa de request com email invalido!!!" });
		}
	} catch (error) {
		Logger.error("Tentativa de request com wrong token");
		return res
			.status(401)
			.send({ msg: "Tentativa de request com wrong token!!!" });
	}
}
