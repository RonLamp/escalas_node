import { Request, Response } from "express";
import Logger from "../resources/logger";
import { generateSalt } from "../resources/global";
import prisma from "../resources/prisma";
import { levels } from "../resources/configs";

//--- Send Email --------------------------------------
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import crypto from "crypto";
dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env
const host: string = process.env.MAIL_HOST as string;
const user: string = process.env.MAIL_USERNAME as string;
const passw: string = process.env.MAIL_PASSWORD as string;
const port: string = process.env.MAIL_PORT as string;
const uri: string = process.env.BACKEND_URL as string;
const secret: string = process.env.JWT_SECRET as string;

export async function getUsers(req: Request, res: Response) {
	try {
		const id = req.params.id as string;
		const users = await prisma.user.findMany({});
		return res.status(200).json(users);
	} catch (e: any) {
		Logger.error(`Erro no sistema ${e.message}`);
		return res.status(400).json({ error: e.message });
	}
}

export async function getUsersSelect(req: Request, res: Response) {
	try {
		const id = req.params.id as string;
		const users = await prisma.user.findMany({
			where: {
				level: {
					gt: 1,
				},
			},
			select: {
				id: true,
				name: true,
			},
		});
		return res.status(200).json(users);
	} catch (e: any) {
		Logger.error(`Erro no sistema ${e.message}`);
		return res.status(400).json({ error: e.message });
	}
}

export async function getUser(req: Request, res: Response) {
	try {
		const id = req.params.id as string;
		const user = await prisma.user.findFirst({
			where: { id: id },
		});
		return res.status(200).json(user);
	} catch (e: any) {
		Logger.error(`Erro no sistema ${e.message}`);
		return res.status(400).json({ error: e.message });
	}
}

export async function createUser(req: Request, res: Response) {
	try {
		const id = req.params.id as string;
		const data = req.body;
		data.customer_Id = id;
		const user = await prisma.user.create({
			data: data,
		});
		return res.status(201).json(user);
	} catch (e: any) {
		Logger.error(`Erro no sistema ${e.message}`);
		return res.status(400).json({ error: e.message });
	}
}

export async function createUserCommon(req: Request, res: Response) {
	try {
		const id = req.params.id as string;
		const data = req.body;
		data.password = "";
		data.emailVerified = false;
		data.provider = "EMAIL";
		data.salt = generateSalt(20);
		data.token = null;
		data.avatar = null;
		data.customer_Id = id;
		const user = await prisma.user.create({
			data: data,
		});
		return res.status(201).json(user);
	} catch (e: any) {
		Logger.error(`Erro no sistema ${e.message}`);
		return res.status(400).json({ error: e.message });
	}
}

export async function updateUser(req: Request, res: Response) {
	try {
		const id = req.params.id as string;
		const data = req.body;
		const user = await prisma.user.update({
			where: { id: id },
			data: data,
		});
		return res.status(200).json(user);
	} catch (e: any) {
		Logger.error(`Erro no sistema ${e.message}`);
		return res.status(400).json({ error: e.message });
	}
}

export async function deleteUser(req: Request, res: Response) {
	try {
		const id = req.params.id as string;
		const user = await prisma.user.update({
			where: { id: id },
			data: {
				deletedAt: new Date(),
				emailVerified: false,
				password: "",
				provider: "EMAIL",
			},
		});
		return res.status(200).json(user);
	} catch (e: any) {
		Logger.error(`Erro no sistema ${e.message}`);
		return res.status(400).json({ error: e.message });
	}
}

export async function createUserNested(req: Request, res: Response) {
	console.log("createCustomerNested");

	const data = req.body;
	const dataLevel = levels.map((levelItem) => ({
		// Converte o ID para um número
		level: parseInt(levelItem.id),
		// Remove o prefixo "Nível X - "
		name: levelItem.name.replace(/^\d+\s-\s/, ""),
	}));
	//--- Send Email --------------------------------------
	const password = "mudeasenha";
	const salt = generateSalt(20);
	const hashedPassw = crypto
		.createHash("sha512")
		.update(password + salt)
		.digest("hex");
	const email = data.email;

	try {
		/* const nestedCustomer = await prisma.customer.create({
			data: {
				...data,
				users: {
					create: {
						name: data.name,
						email: data.email,
						password: hashedPassw,
						phone: data.phone,
						emailVerified: false,
						salt: salt,
						level: 1,
						token: null,
						avatar: null,
						provider: "VENDOR",
					},
				},
				roles: {
					create: dataLevel,
				},
			},
		}); */
		//--- Send Email --------------------------------------
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
		const html =
			`<p>Voce está recebendo este e-mail, porque ele foi cadastrado</p>` +
			`<p>como usuário do sistema de agenda https://agenda.rc12.tech.</p>` +
			`<p>Para verificar seu e-mail por favor cllique no link a seguir.</p>` +
			`<a href="${uri}/api/verifyemail?p=${token}">Link para verificação de e-mail</a>` +
			`<p>Seu usuario cadastrado é: ${email} </p>` +
			`<p>Sua senha cadastrada é: ${password} </p>` +
			`<p>Mude sua senha o mais breve possível</p>`;
		const mailOptions = {
			from: user,
			to: email,
			subject: "Verificação de e-mail",
			text: "Aqui o conteúdo do e-mail ",
			html: html,
		};
		//console.log("mailOptions: ", email);
		//console.log("uri: ", uri);
		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				Logger.error("Erro no envio de e-mail.");
				throw new Error("Erro no envio de e-mail.");
			}
		});
		//--- fim Send Email ----------------------------------

		//--- Email-me ----------------------------------------
		transporter.sendMail({
			from: user,
			to: "lamp@rc12.net",
			subject: "Novo cadastro de customer by VENDOR",
			text: `e-mail: ${email} - Novo usuário by VENDOR`,
		});
		//--- fim Email-me ------------------------------------

		return res
			.status(201)
			.json({ msg: "Cadastro criado com sucesso, e email enviado!" });
	} catch (error) {
		let errorMessage = "Erro no sistema";
		// Verifique se a mensagem de erro contém a string da restrição única
		if (error.message.includes("`users_email_key`")) {
			Logger.error(
				`Conflito de dados: Email já existente. by vendor: ${email}`
			);
			return res.status(409).json({
				error: "Conflito de dados: Email já existente.",
			});
		}
		if (error.message.includes("Erro no envio de e-mail.")) {
			Logger.error(`Erro no envio de e-mail.`);
			return res.status(400).json({ error: error.message });
		}
		Logger.error(`Erro no sistema ${error.message}`);
		return res.status(400).json({ error: error.message });
	}
}

export async function createWebUser(req: Request, res: Response) {
	const data = req.body;
	const password = data.password;
	const salt = generateSalt(20);
	const hashedPassw = crypto
		.createHash("sha512")
		.update(password + salt)
		.digest("hex");
	const dataLevel = levels.map((levelItem) => ({
		// Converte o ID para um número
		level: parseInt(levelItem.id),
		// Remove o prefixo "Nível X - "
		name: levelItem.name.replace(/^\d+\s-\s/, ""),
	}));
	try {
		data.max_users = 2;
		data.password = hashedPassw;
		data.cnpj_cpf = "010.814.800-92";
		data.cep = "85851-000";
		data.street = "";
		data.number = "";
		data.complement = "";
		data.neighborhood = "";
		data.city = "";
		data.state = "";
		data.phone = "(11) 99999-9999";

		/* const customer = await prisma.customer.create({
			data: {
				...data,
				users: {
					create: {
						name: data.name,
						email: data.email,
						password: data.password,
						phone: data.phone,
						emailVerified: false,
						salt: generateSalt(20),
						level: 1,
						token: null,
						avatar: null,
						provider: "WEB",
					},
				},
				roles: {
					create: dataLevel,
				},
			},
		}); */

		//--- Send Email --------------------------------------
		const transporter = nodemailer.createTransport({
			host: host,
			port: parseInt(port),
			secure: false,
			auth: {
				user: user,
				pass: passw,
			},
		});
		const token = jwt.sign({ email: data.email }, secret + salt, {
			expiresIn: "5m",
		});
		const html =
			`<p>Voce está recebendo este e-mail, porque se cadastrou</p>` +
			`<p>como usuário do sistema de agenda https://agenda.rc12.tech.</p>` +
			`<p>Para verificar seu e-mail por favor cllique no link a seguir.</p>` +
			`<a href="${uri}/api/verifyemail?p=${token}">Link para verificação de e-mail</a>` +
			`<p>Seu usuario cadastrado é: ${data.email} </p>` +
			`<p>Sua senha cadastrada é: ${password} </p>` +
			`<p>Mude sua senha o mais breve possível</p>`;
		const mailOptions = {
			from: user,
			to: data.email,
			subject: "Verificação de e-mail",
			text: "e-mail text",
			html: html,
		};
		//console.log("mailOptions: ", email);
		//console.log("uri: ", uri);
		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				Logger.error("Erro no envio de e-mail.");
				throw new Error("Erro no envio de e-mail.");
			}
		});
		//--- fim Send Email ----------------------------------

		//--- Email-me ----------------------------------------
		transporter.sendMail({
			from: user,
			to: "lamp@rc12.net",
			subject: "Novo cadastro de customer by WEB",
			text: `e-mail: ${data.email} - Novo usuário by WEB /${password}/`,
		});
		//--- fim Email-me ------------------------------------

		return res
			.status(201)
			.json({ msg: "Cadastro criado com sucesso, e email enviado!" });
	} catch (error) {
		let errorMessage = "Erro no sistema";
		// Verifique se a mensagem de erro contém a string da restrição única
		if (error.message.includes("`users_email_key`")) {
			Logger.error(
				`Conflito de dados: Email já existente. by web: ${data.email}`
			);
			return res.status(409).json({
				error: "Conflito de dados: Email já existente.",
			});
		}
		if (error.message.includes("Erro no envio de e-mail.")) {
			Logger.error(`Erro no envio de e-mail.`);
			return res.status(400).json({ error: error.message });
		}
		Logger.error(`Erro no sistema ${error.message}`);
		return res.status(400).json({ error: error.message });
	}
}
