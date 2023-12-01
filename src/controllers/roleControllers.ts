import { Request, Response } from "express";
import Logger from "../resources/logger";
import prisma from "../resources/prisma";
// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();

export async function getRoles(req: Request, res: Response) {
	try {
		const id = req.params.id as string;
		const roles = await prisma.role.findMany({});
		return res.status(200).json(roles);
	} catch (e: any) {
		Logger.error(`Erro no sistema ${e.message}`);
		return res.status(400).json({ error: e.message });
	}
}

export async function getRolesSelect(req: Request, res: Response) {
	try {
		const id = req.params.id as string;
		const roles = await prisma.role.findMany({
			select: {
				level: true,
				name: true,
			},
		});
		const rolesWithRenamedId = roles.map((role) => ({
			id: role.level, // Renomeando 'level' para 'id'
			name: role.name,
		}));
		return res.status(200).json(rolesWithRenamedId);
	} catch (e: any) {
		Logger.error(`Erro no sistema ${e.message}`);
		return res.status(400).json({ error: e.message });
	}
}

export async function getRole(req: Request, res: Response) {
	try {
		const id = req.params.id as string;
		const role = await prisma.role.findFirst({
			where: { id: id },
		});
		return res.status(200).json(role);
	} catch (e: any) {
		Logger.error(`Erro no sistema ${e.message}`);
		return res.status(400).json({ error: e.message });
	}
}

export async function createRole(req: Request, res: Response) {
	try {
		const id = req.params.id as string;
		const data = req.body;
		data.customer_Id = id;
		const role = await prisma.role.create({
			data: data,
		});
		return res.status(201).json(role);
	} catch (e: any) {
		Logger.error(`Erro no sistema ${e.message}`);
		return res.status(400).json({ error: e.message });
	}
}

export async function updateRole(req: Request, res: Response) {
	try {
		const id = req.params.id as string;
		const data = req.body;
		const role = await prisma.role.update({
			where: { id: id },
			data: data,
		});
		return res.status(200).json(role);
	} catch (e: any) {
		Logger.error(`Erro no sistema ${e.message}`);
		return res.status(400).json({ error: e.message });
	}
}

export async function deleteRole(req: Request, res: Response) {
	try {
		const id = req.params.id as string;
		const role = await prisma.role.update({
			where: { id: id },
			data: {
				deletedAt: new Date(),
			},
		});
		return res.status(200).json(role);
	} catch (e: any) {
		Logger.error(`Erro no sistema ${e.message}`);
		return res.status(400).json({ error: e.message });
	}
}
