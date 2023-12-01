import { body } from "express-validator";

export const groupValidation = () => {
	return [
		body("name")
			.isString()
			.withMessage("O nome é obrigatorio")
			.isLength({ min: 3, max: 50 })
			.withMessage("O nome deve ter entre 3 e 50 caracteres"),
	];
};
