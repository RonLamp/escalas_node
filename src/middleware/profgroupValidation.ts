import { body } from "express-validator";

export const profgroupValidation = () => {
	return [
		body("color")
			.notEmpty()
			.withMessage("O valor color não pode estar vazio")
			.isString()
			.withMessage("O valor color deve ser string"),
	];
};

export const relprofgroupValidation = () => {
	return [
		body(".id")
			.custom((value) => {
				if (
					value === "" ||
					/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
						value
					)
				) {
					return true; // É um UUID ou uma string vazia, válido
				}
				return false; // Não é um UUID ou uma string vazia, inválido
			})
			.withMessage("O id deve ser um UUID válido ou uma string vazia"),

		body("color")
			.notEmpty()
			.withMessage("O valor color não pode estar vazio")
			.isString()
			.withMessage("O valor color deve ser string"),

		body("profiss_name")
			.isString()
			.withMessage("O nome é obrigatorio")
			.isLength({ min: 3, max: 50 })
			.withMessage("O nome deve ter entre 3 e 50 caracteres"),

		body("profiss_Id")
			.isUUID()
			.withMessage("O profiss_Id deve ser um UUID válido")
			.notEmpty()
			.withMessage("O profiss_Id é obrigatório"),
	];
};

export const relsprofgroupValidation = () => {
	return [
		body("*.id")
			.custom((value) => {
				if (
					value === "" ||
					/[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/.test(
						value
					)
				) {
					return true; // É um UUID ou uma string vazia, válido
				}
				return false; // Não é um UUID ou uma string vazia, inválido
			})
			.withMessage("O id[] deve ser um UUID válido ou uma string vazia"),

		body("*.color")
			.notEmpty()
			.withMessage("O valor color não pode estar vazio")
			.isString()
			.withMessage("O valor color deve ser string"),

		body("*.profiss_name")
			.isString()
			.withMessage("O nome é obrigatorio")
			.isLength({ min: 3, max: 50 })
			.withMessage("O nome deve ter entre 3 e 50 caracteres"),

		body("*.profiss_Id")
			.isUUID()
			.withMessage("O profiss_Id deve ser um UUID válido")
			.notEmpty()
			.withMessage("O profiss_Id é obrigatório"),
	];
};
