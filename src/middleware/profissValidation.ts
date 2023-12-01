import { body } from "express-validator";

export const profissValidation = () => {
	return [
		body("name")
			.isString()
			.withMessage("O nome é obrigatorio")
			.isLength({ min: 3, max: 50 })
			.withMessage("O nome deve ter entre 3 e 50 caracteres"),
		body("born")
			.isISO8601()
			.withMessage(
				"A data deve estar no formato ISO 8601 (exemplo: 2023-08-24T12:34:56.789Z)"
			),
		body("crm")
			.isString()
			.withMessage("O crm é obrigatorio")
			.isLength({ min: 3, max: 20 })
			.withMessage("O crm deve ter entre 3 e 20 caracteres"),
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
		//--- informações não obrigatórias -------------------------------
		body("cep").custom((value) => {
			if (/^\d{5}-\d{3}$/.test(value)) {
				return true;
			} else {
				throw new Error("O CEP deve ter 99999-999");
			}
		}),
		body("street").custom((value) => {
			if (/^.{4,}$/.test(value)) {
				return true;
			} else {
				throw new Error("A rua deve ter no mínimo 3 caracteres ");
			}
		}),
		body("number").custom((value) => {
			if (/^[1-9]\d{1,5}$/.test(value)) {
				return true;
			} else {
				throw new Error("O número deve ter entre 1 e 6 caracteres ");
			}
		}),
		body("complement").optional({ nullable: true }),
		body("neighborhood").custom((value) => {
			if (/^.{4,}$/.test(value)) {
				return true;
			} else {
				throw new Error("o bairro deve ter no mínimo 3 caracteres");
			}
		}),
		body("city").custom((value) => {
			if (/^.{4,}$/.test(value)) {
				return true;
			} else {
				throw new Error("A cidade deve ter no mínimo 3 caracteres ");
			}
		}),
		body("state").custom((value) => {
			if (/^[A-Z]{2}$/.test(value)) {
				return true;
			} else {
				throw new Error("A rua deve ter no mínimo 3 caracteres ");
			}
		}),
		body("notes").custom((value) => {
			if (/^.{1,}$/.test(value)) {
				return true;
			} else {
				throw new Error("Notes pode ter mais de 1 caracter ");
			}
		}),
	];
};
