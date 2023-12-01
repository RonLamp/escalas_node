import { Request, Response } from "express";
import Logger from "../resources/logger";
import prisma from "../resources/prisma";

export async function getGroups(req: Request, res: Response) {
	try {
		const id = req.params.id as string;
		const groups = await prisma.groups.findMany({});
		return res.status(200).json(groups);
	} catch (e: any) {
		Logger.error(`Erro no sistema ${e.message}`);
		return res.status(400).json({ error: e.message });
	}
}

export async function getGroupsSelect(req: Request, res: Response) {
	try {
		const id = req.params.id as string;
		const groups = await prisma.groups.findMany({
			select: {
				id: true,
				name: true,
			},
		});
		return res.status(200).json(groups);
	} catch (e: any) {
		Logger.error(`Erro no sistema ${e.message}`);
		return res.status(400).json({ error: e.message });
	}
}

export async function getGroup(req: Request, res: Response) {
	try {
		const id = req.params.id as string;
		const group = await prisma.groups.findFirst({
			where: { id: id },
		});
		console.log(group);

		return res.status(200).json(group);
	} catch (e: any) {
		Logger.error(`Erro no sistema ${e.message}`);
		return res.status(400).json({ error: e.message });
	}
}

export async function createGroup(req: Request, res: Response) {
	try {
		const data = req.body;
		const group = await prisma.groups.create({
			data: data,
		});
		return res.status(201).json(group);
	} catch (e: any) {
		Logger.error(`Erro no sistema ${e.message}`);
		return res.status(400).json({ error: e.message });
	}
}

export async function updateGroup(req: Request, res: Response) {
	try {
		const id = req.params.id as string;
		const data = req.body;
		const group = await prisma.groups.update({
			where: { id: id },
			data: data,
		});
		return res.status(200).json(group);
	} catch (e: any) {
		Logger.error(`Erro no sistema ${e.message}`);
		return res.status(400).json({ error: e.message });
	}
}

export async function deleteGroup(req: Request, res: Response) {
	try {
		const id = req.params.id as string;
		const group = await prisma.groups.update({
			where: { id: id },
			data: {
				deletedAt: new Date(),
			},
		});
		return res.status(200).json(group);
	} catch (e: any) {
		Logger.error(`Erro no sistema ${e.message}`);
		return res.status(400).json({ error: e.message });
	}
}
