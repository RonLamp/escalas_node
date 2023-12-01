import e, { Request, Response } from "express";
import Logger from "../resources/logger";
import prisma from "../resources/prisma";

interface IRelProfGroup {
	id: string;
	color: string;
	profiss_Id: string;
	profiss_name: string;
}

export async function getRelProfsGroupByGroup(req: Request, res: Response) {
	try {
		const groupid = req.params.groupid as string;
		const relProfsGroup = await prisma.relProfGroup.findMany({
			where: {
				group_Id: groupid,
			},
			select: {
				id: true,
				profiss_Id: true,
				profiss: {
					select: {
						id: true,
						name: true,
					},
				},
				color: true,
			},
		});
		// Transformação para o formato da segunda interface
		const relProfsGroupT: IRelProfGroup[] = relProfsGroup.map((item) => ({
			id: item.id,
			color: item.color,
			profiss_Id: item.profiss_Id,
			profiss_name: item.profiss.name,
		}));
		return res.status(200).json(relProfsGroupT);
	} catch (e: any) {
		Logger.error(`Erro no sistema ${e.message}`);
		return res.status(500).json({ msg: "Erro no sistema" });
	}
}

export async function getRelProfGroup(req: Request, res: Response) {
	try {
		const id = req.params.id as string;
		const relProfSpec = await prisma.relProfGroup.findFirst({
			where: { id: id },
		});
		return res.status(200).json(relProfSpec);
	} catch (e: any) {
		Logger.error(`Erro no sistema ${e.message}`);
		return res.status(500).json({ msg: "Erro no sistema" });
	}
}

export async function createRelProfGroup(req: Request, res: Response) {
	try {
		const groupid = req.params.groupid as string;
		const profissid = req.params.profissid as string;
		const data = req.body;
		data.profiss = { connect: { id: profissid } }; // Conectar ao relProfGroup existente
		data.group = { connect: { id: groupid } }; // Conectar ao relProfGroup existente

		const relProfGroup = await prisma.relProfGroup.create({
			data: data,
		});
		return res.status(201).json(relProfGroup);
	} catch (e: any) {
		Logger.error(`createRelProfGroup faill!!!`);
		return res.status(500).json({ msg: "Inclusão não realizada" });
	}
}

export async function updateRelProfGroup(req: Request, res: Response) {
	try {
		const id = req.params.id as string;
		const data = req.body;
		const relProfSpec = await prisma.relProfGroup.updateMany({
			where: { id: id },
			data: data,
		});
		return res.status(200).json(relProfSpec);
	} catch (e: any) {
		Logger.error(`Erro no sistema ${e.message}`);
		return res.status(500).json({ msg: "Alteração não realizada" });
	}
}

interface IRelProfGroupOut {
	id: string;
	color: string;
	profiss_Id: string;
	profiss_name: string;
}

export async function createRelProfGroupSome(req: Request, res: Response) {
	try {
		const groupid = req.params.groupid as string;
		const data = req.body;
		const dataCreate: IRelProfGroupOut[] = data
			.filter((item: IRelProfGroup) => item.id === "")
			.map((item: IRelProfGroup) => ({
				id: item.id,
				color: item.color,
				profiss_Id: item.profiss_Id,
				profiss_name: item.profiss_name,
			}));
		const dataUpdate: IRelProfGroupOut[] = data
			.filter((item: IRelProfGroup) => item.id !== "")
			.map((item: IRelProfGroup) => ({
				id: item.id,
				color: item.color,
				profiss_Id: item.profiss_Id,
				profiss_name: item.profiss_name,
			}));
		// Inclusão
		for (const item of dataCreate) {
			await prisma.relProfGroup.create({
				data: {
					color: item.color,
					group: {
						connect: {
							id: groupid,
						},
					},
					profiss: {
						connect: {
							id: item.profiss_Id,
						},
					},
				},
			});
		}
		// Alteração
		for (const item of dataUpdate) {
			await prisma.relProfGroup.update({
				where: { id: item.id },
				data: {
					color: item.color,
				},
			});
		}
		return res.status(201).json({ msg: "Inclusão realizada" });
	} catch (e: any) {
		Logger.error(`Erro no sistema ${e.message}`);
		return res.status(500).json({ msg: "Inclusão não realizada" });
	}
}
