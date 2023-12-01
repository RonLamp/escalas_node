import morgan, { StreamOptions } from "morgan";
import dotenv from "dotenv";
import Logger from "../resources/logger";
import jwt from "jsonwebtoken"; // Importe a biblioteca JWT para verificar o token
import IJWTPayload from "../interfaces/jwtPayload";

dotenv.config();

const stream: StreamOptions = {
	write: (message) => Logger.http(message),
};

const skip = () => {
	const env = String(process.env.APP_ENV) || "development";
	return env != "development";
};

const morganMiddleware = morgan(
	(tokens, req, res) => {
		const authHeader = req.headers["authorization"];
		if (!authHeader) {
			return;
		} // Logger.http("N/A");}
		else {
			const token = authHeader.split(" ")[1]; // Obtém o token Bearer
			const { email } = jwt.decode(token) as IJWTPayload;
			return `User: ${email} - ${tokens.method(req, res)} ${tokens.url(
				req,
				res
			)} ${tokens.status(req, res)} ${tokens.res(
				req,
				res,
				"content-length"
			)} - ${tokens["response-time"](req, res)} ms}`;
			// - Body:${JSON.stringify(req.token)}`;
			// )} - ${tokens["response-time"](req, res)} ms`;
		}
	},
	{ stream, skip }
);

export default morganMiddleware;

//------------------------------------------------------------
//-------  FUSO  ---------------------------------------------
// Função para extrair o usuário do Bearer Token
// const extractUserFromBearerToken = (req) => {
//   const authHeader = req.headers["authorization"];
//   if (authHeader) {
//     const token = authHeader.split(" ")[1]; // Obtém o token Bearer
//     const { email } = jwt.decode(token) as IJWTPayload;
//     if (token) {
//       try {
//         const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Decodifica o token
//         if (decodedToken && decodedToken.email) {
//           return decodedToken.; // Retorna o usuário do token
//         }
//       } catch (error) {
//         // Handle error (token inválido, expirado, etc.)
//       }
//     }
//   }
//   return "N/A"; // Retorna um valor padrão se o usuário não puder ser extraído
// };

//------------------------------------------------------------
//------------------------------------------------------------
// import morgan, { StreamOptions } from "morgan";
// import dotenv from "dotenv";
// import Logger from "../configs/logger";

// dotenv.config();
// const stream: StreamOptions = {
// 	write: (message) => Logger.http(message),
// };
// const skip = () => {
// 	const env = String(process.env.APP_ENV) || "development";
// 	return env != "development";
// };
// const morganMiddleware = morgan(
// 	":method :url :status :res[content-length] - :response-time ms",
// 	{ stream, skip }
// );
// export default morganMiddleware;
