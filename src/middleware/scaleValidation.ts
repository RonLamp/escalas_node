import { body } from "express-validator";

export const scaleValidation = () => {
	return [
		body("name")
			.isString()
			.withMessage("O nome é obrigatorio")
			.isLength({ min: 3, max: 50 })
			.withMessage("O nome deve ter entre 3 e 50 caracteres"),
		body("start")
			.notEmpty()
			.withMessage("O horário inicial é obrigatório")
			.isString()
			.withMessage("O horário deve ser uma string"),
		body("end")
			.notEmpty()
			.withMessage("O horário final é obrigatório")
			.isString()
			.withMessage("O horário deve ser uma string"),
		body("group_Id")
			.notEmpty()
			.withMessage("O group_Id é obrigatório")
			.isUUID()
			.withMessage("O group_Id deve ser um uuid válido"),
	];
};
