import { Request, Response } from "express";
import Logger from "../resources/logger";
import prisma from "../resources/prisma";
// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();

export async function getProfisss(req: Request, res: Response) {
	try {
		//const id = req.params.id as string;
		const profisss = await prisma.profiss.findMany({});
		return res.status(200).json(profisss);
	} catch (e: any) {
		Logger.error(`Erro no sistema ${e.message}`);
		return res.status(400).json({ error: e.message });
	}
}

export async function getProfisssSelect(req: Request, res: Response) {
	try {
		//const id = req.params.id as string;
		const profisss = await prisma.profiss.findMany({
			select: {
				id: true,
				name: true,
			},
		});
		return res.status(200).json(profisss);
	} catch (e: any) {
		Logger.error(`Erro no sistema ${e.message}`);
		return res.status(400).json({ error: e.message });
	}
}

interface IProfissGroupProps {
	profiss_Id: string;
	profiss_name: string;
	color: string;
}

export async function getProfisssGroup(req: Request, res: Response) {
	try {
		const groupid = req.params.groupid as string;
		const profisss = await prisma.groups.findMany({
			where: { id: groupid },
			select: {
				relprofgroups: {
					select: {
						color: true,
						profiss: {
							select: {
								id: true,
								name: true,
							},
						},
					},
				},
			},
		});
		const profisssT: IProfissGroupProps[] = [];
		profisss.map((item) => {
			item.relprofgroups.map((item2) => {
				profisssT.push({
					profiss_Id: item2.profiss.id,
					profiss_name: item2.profiss.name,
					color: item2.color,
				});
			});
		});
		return res.status(200).json(profisssT);
	} catch (e: any) {
		Logger.error(`Erro no sistema ${e.message}`);
		return res.status(400).json({ error: e.message });
	}
}

export async function getProfiss(req: Request, res: Response) {
	try {
		const id = req.params.id as string;
		const profiss = await prisma.profiss.findFirst({
			where: { id: id },
		});
		return res.status(200).json(profiss);
	} catch (e: any) {
		Logger.error(`Erro no sistema ${e.message}`);
		return res.status(400).json({ error: e.message });
	}
}

export async function createProfiss(req: Request, res: Response) {
	try {
		//const id = req.params.id as string;
		const data = req.body;
		//data.customer = { connect: { id: id } }; // Conectar ao profisse existente
		const profiss = await prisma.profiss.create({
			data: data,
		});
		return res.status(201).json(profiss);
	} catch (e: any) {
		Logger.error(`Erro no sistema ${e.message}`);
		return res.status(400).json({ error: e.message });
	}
}

export async function updateProfiss(req: Request, res: Response) {
	try {
		const id = req.params.id as string;
		const data = req.body;
		const profiss = await prisma.profiss.update({
			where: { id: id },
			data: data,
		});
		return res.status(200).json(profiss);
	} catch (e: any) {
		Logger.error(`Erro no sistema ${e.message}`);
		return res.status(400).json({ error: e.message });
	}
}

export async function deleteProfiss(req: Request, res: Response) {
	try {
		const id = req.params.id as string;
		const profiss = await prisma.profiss.update({
			where: { id: id },
			data: {
				deletedAt: new Date(),
			},
		});
		return res.status(200).json(profiss);
	} catch (e: any) {
		Logger.error(`Erro no sistema ${e.message}`);
		return res.status(400).json({ error: e.message });
	}
}
