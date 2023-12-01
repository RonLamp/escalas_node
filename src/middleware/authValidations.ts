import { body, header, query } from "express-validator";

export const authJWTValidation = () => {
	return [
		body("email").isEmail().withMessage("Email inválido"),
		body("password")
			.isString()
			.withMessage("O password é obrigatorio")
			.isLength({ min: 6 })
			.withMessage("O password deve conter no mínimo 6 caracteres"),
	];
};

export const authSendemailValidation = () => {
	return [body("email").isEmail().withMessage("Email inválido")];
};

export const authChangeemailValidation = () => {
	return [
		header("Authorization").isString().withMessage("O token é obrigatorio"),
		// .isJWT()
		// .withMessage("O token é inválido"),
		body("passw").isString().withMessage("A Senha é obrigatória"),
	];
};

export const authVerifyemailValidation = () => {
	return [
		query("p")
			.isString()
			.withMessage("O token é obrigatorio")
			.isJWT()
			.withMessage("O token é inválido"),
	];
};

export const webCustomerValidation = () => {
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
		body("password")
			.isString()
			.withMessage("O password é obrigatorio")
			.isLength({ min: 6 })
			.withMessage("O password deve conter no mínimo 6 caracteres"),
	];
};

// export const authRegisterGoogleValidation = () => {
// 	return [
// 		body("email").isEmail().withMessage("Email inválido"),
// 		body("name").isString().withMessage("O Nome é obrigatório"),
// 		body("id").isString().withMessage("O id é obrigatório"),
// 		body("avatar_url").isString().withMessage("A url é obrigatória"),
// 	];
// };

// export const authTokenValidation = () => {
// 	return [body("token").isString().withMessage("O token é obrigatorio")];
// };
