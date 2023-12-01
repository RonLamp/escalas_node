import { body } from "express-validator";

export const userCommonValidation = () => {
	return [
		body("name")
			.isString()
			.withMessage("O nome é obrigatorio")
			.isLength({ min: 3, max: 50 })
			.withMessage("O nome deve ter entre 3 e 50 caracteres"),
		body("email")
			.isString()
			.withMessage("O email é obrigatorio")
			.isEmail()
			.withMessage("O email é inválido"),
		body("phone")
			.isString()
			.withMessage("O telefone é obrigatorio")
			.isLength({ min: 8, max: 21 })
			.withMessage("O telefone deve ter entre 8 e 21 caracteres"),
		body("level")
			.isNumeric()
			.withMessage("O level é obrigatorio e deve ser um número")
			.isLength({ min: 1, max: 1 })
			.withMessage("O level deve ter 1 caracter")
			.custom((value) => {
				const numericValue = parseInt(value, 10);
				if (numericValue >= 2 && numericValue <= 4) {
					return true;
				} else {
					throw new Error('O campo "level" deve estar entre 1 e 6.');
				}
			}),
	];
};

export const userOwnerValidation = () => {
	return [
		body("name")
			.isString()
			.withMessage("O nome é obrigatorio")
			.isLength({ min: 3, max: 50 })
			.withMessage("O nome deve ter entre 3 e 50 caracteres"),
		body("email")
			.isString()
			.withMessage("O email é obrigatorio")
			.isEmail()
			.withMessage("O email é inválido"),
		body("phone")
			.isString()
			.withMessage("O telefone é obrigatorio")
			.isLength({ min: 8, max: 15 })
			.withMessage("O telefone deve ter entre 8 e 15 caracteres"),
		body("level")
			.isNumeric()
			.withMessage("O level é obrigatorio e deve ser um número")
			.isLength({ min: 1, max: 1 })
			.withMessage("O level deve ter 1 caracter")
			.custom((value) => {
				const numericValue = parseInt(value, 10);
				if (numericValue >= 1 && numericValue <= 6) {
					return true;
				} else {
					throw new Error('O campo "level" deve estar entre 1 e 6.');
				}
			}),
		body("salt")
			.isString()
			.withMessage("O salt deve ser uma String")
			.isLength({ min: 20, max: 20 })
			.withMessage("O salt deve ter 20 caracteres"),
		body("avatar")
			.isURL()
			.withMessage("O avatar deve ser uma URL válida")
			.optional(),
		body("token")
			.isString()
			.withMessage("O token deve ser uma String")
			.optional(),
		body("provider")
			.isString()
			.withMessage("O provider deve ser uma String")
			.isIn(["EMAIL", "GOOGLE", "FACEBOOK"])
			.withMessage('O provider deve ser "EMAIL", "GOOGLE" ou "FACEBOOK".'),
		body("emailVerified")
			.isBoolean()
			.withMessage("O emailVerified deve ser um Boolean"),
	];
};
