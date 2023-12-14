import express, { Request, Response, NextFunction } from "express";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import cors from "cors";
import { corsOptions } from "./resources/cors";
import path from "path";
import morganMiddleware from "./middleware/morgan";
import openRoutes from "./routes/openRoutes";
import closeRoutes from "./routes/closeRoutes";
import dotenv from "dotenv";
dotenv.config();

const app = express();
export const __basedir = path.resolve(__dirname);

//--- CORS --( first middleware ) --------------------------------------------
app.use(cors(corsOptions));

//--- Middlewares ------------------------------------------------------------
app.use(express.json());
app.use(morganMiddleware);

//--- Static files -----------------------------------------------------------
app.use(express.static(path.join(__basedir, "public")));

//--- Routes -----------------------------------------------------------------
app.use("", openRoutes);
app.use("/api", closeRoutes);

//--- Middleware para tratar erros de rotas não encontradas ------------------
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).sendFile(path.join(__basedir + "/public/404.html"));
});

//--- Listen server
const PORT = process.env.PORT || 3000;
const APP_ORIGIN = process.env.APP_ORIGIN;

app.listen(PORT, () => {
  console.log(
    `Server running on port:${PORT} date: ${new Date().toISOString()} APP_ORIGIN: ${APP_ORIGIN}`
  );
});

// Feche a conexão do Prisma Client quando o aplicativo for encerrado
process.on("SIGINT", () => {
  prisma.$disconnect();
  process.exit();
});
