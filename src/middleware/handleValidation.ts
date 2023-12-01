import { Request, Response, NextFunction } from "express";
import { validationResult, query, param } from "express-validator";
import Logger from "../resources/logger";
// import jwt from "jsonwebtoken";

// Esta função de middleware é responsável por verificar se há erros de validação
// nos dados da requisição. Se houver erros, ela gera uma resposta de erro com
// detalhes sobre os erros encontrados.
// Se não houver erros, permite que o fluxo da requisição continue para o próximo
// middleware ou rota.
export const validate = (req: Request, res: Response, next: NextFunction) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const extractErrors: object[] = [];
		errors.array().map((err) => extractErrors.push({ [err.type]: err.msg }));
		Logger.error("Tentativa de request com validate error");
		console.log(extractErrors);

		return res.status(422).json({
			errors: extractErrors,
		});
	}
	return next();
};

export const idParamValidation = () => {
	return [
		param("id")
			.isString()
			.withMessage("O id é obrigatorio")
			.isUUID()
			.withMessage("O id é inválido"),
	];
};

export const idParamGroupValidation = () => {
	return [
		param("groupid")
			.isString()
			.withMessage("O id é obrigatorio")
			.isUUID()
			.withMessage("O id é inválido"),
	];
};
