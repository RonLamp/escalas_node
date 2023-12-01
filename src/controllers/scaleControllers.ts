import { Request, Response } from "express";
import Logger from "../resources/logger";
import prisma from "../resources/prisma";

export async function getScales(req: Request, res: Response) {
	try {
		const scales = await prisma.scale.findMany({});
		return res.status(200).json(scales);
	} catch (e: any) {
		Logger.error(`Erro no sistema ${e.message}`);
		return res.status(400).json({ error: e.message });
	}
}

export async function getScalesBygroup(req: Request, res: Response) {
	try {
		const groupid = req.params.groupid as string;
		const scales = await prisma.scale.findMany({
			where: { group_Id: groupid },
			select: {
				id: true,
				name: true,
			},
		});
		return res.status(200).json(scales);
	} catch (e: any) {
		Logger.error(`Erro no sistema ${e.message}`);
		return res.status(400).json({ error: e.message });
	}
}

export async function getScalesSelect(req: Request, res: Response) {
	try {
		const scales = await prisma.scale.findMany({
			select: {
				id: true,
				name: true,
			},
		});
		return res.status(200).json(scales);
	} catch (e: any) {
		Logger.error(`Erro no sistema ${e.message}`);
		return res.status(400).json({ error: e.message });
	}
}

export async function getScale(req: Request, res: Response) {
	try {
		const id = req.params.id as string;
		const scale = await prisma.scale.findFirst({
			where: { id: id },
		});
		console.log(scale);

		return res.status(200).json(scale);
	} catch (e: any) {
		Logger.error(`Erro no sistema ${e.message}`);
		return res.status(400).json({ error: e.message });
	}
}

export async function createScale(req: Request, res: Response) {
	try {
		const data = req.body;
		const scale = await prisma.scale.create({
			data: data,
		});
		return res.status(201).json(scale);
	} catch (e: any) {
		Logger.error(`Erro no sistema ${e.message}`);
		return res.status(400).json({ error: e.message });
	}
}

export async function updateScale(req: Request, res: Response) {
	try {
		const id = req.params.id as string;
		const data = req.body;
		const scale = await prisma.scale.update({
			where: { id: id },
			data: data,
		});
		return res.status(200).json(scale);
	} catch (e: any) {
		Logger.error(`Erro no sistema ${e.message}`);
		return res.status(400).json({ error: e.message });
	}
}

export async function deleteScale(req: Request, res: Response) {
	try {
		const id = req.params.id as string;
		const scale = await prisma.scale.update({
			where: { id: id },
			data: {
				deletedAt: new Date(),
			},
		});
		return res.status(200).json(scale);
	} catch (e: any) {
		Logger.error(`Erro no sistema ${e.message}`);
		return res.status(400).json({ error: e.message });
	}
}
