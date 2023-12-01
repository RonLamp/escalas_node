import dotenv from "dotenv"; // Importe o módulo dotenv
dotenv.config(); // Carregue as variáveis de ambiente do arquivo .env

export const authJwt = {
  secret: String(process.env.JWT_SECRET),
  expires: "1d",
};
