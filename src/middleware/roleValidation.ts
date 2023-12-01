import { body } from "express-validator";

export const roleValidation = () => {
	return [
		body("name")
			.isString()
			.withMessage("O nome é obrigatorio")
			.isLength({ min: 3, max: 50 })
			.withMessage("O nome deve ter entre 3 e 50 caracteres"),
		body("level")
			.isNumeric()
			.withMessage("O level é obrigatorio")
			.custom((value) => {
				const level = parseInt(value);
				if (level < 2 || level > 4) {
					throw new Error("O level deve estar entre 2 e 4");
				}
				return true;
			}),
	];
};
