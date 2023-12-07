import { Request, Response } from "express";
import Logger from "../resources/logger";
import prisma from "../resources/prisma";
import dayjs from "dayjs";
import { log } from "console";

interface IDistribsProps {
  id: string;
  data: Date;
  dia: string;
  mes: string;
  obs?: string | null;
  color?: string;
  profiss_id?: string;
  profiss_name?: string;
  scale_id: string;
  scale_name: string;
}

interface IDistribsPropsNoId {
  data: Date;
  obs?: string | null;
  profiss_Id: string;
  group_Id: string;
  scale_Id: string;
}

export async function getDistribs(req: Request, res: Response) {
  try {
    const groupid = req.params.groupid as string;
    const dataIni = req.body.dataIni as string;
    const dataFim = req.body.dataFim as string;
    //console.log('we are here');
    const distribs = await prisma.distrib.findMany({
      where: {
        group_Id: groupid,
        data: {
          gte: dataIni,
          lte: dataFim,
        },
        deletedAt: null,
      },
      select: {
        id: true,
        data: true,
        obs: true,
        profiss: {
          select: {
            id: true,
            name: true,
            relprofgroups: {
              select: {
                color: true,
              },
            },
          },
        },
        scale: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    //console.log(distribs);
    // Transformação para o formato planificado
    const distribsT: IDistribsProps[] = distribs.map((item) => ({
      id: item.id,
      data: item.data,
      dia: dayjs(item.data).format("DD"),
      mes: dayjs(item.data).format("MM"),
      obs: item.obs,
      color: item.profiss?.relprofgroups[0]?.color,
      profiss_id: item.profiss?.id,
      profiss_name: item.profiss?.name,
      scale_id: item.scale.id,
      scale_name: item.scale.name,
    }));
    //console.log(distribsT);
    return res.status(200).json(distribsT);
  } catch (e: any) {
    Logger.error(`Erro no sistema ${e.message}`);
    return res.status(400).json({ error: e.message });
  }
}

/* export async function getScales(req: Request, res: Response) {
	try {
		const scales = await prisma.scale.findMany({});
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
*/

export async function createDistrib(req: Request, res: Response) {
  try {
    const data: IDistribsPropsNoId = req.body;
    const distrib = await prisma.distrib.create({
      data: data,
    });
    return res.status(201).json({ distrib_Id: distrib.id });
  } catch (e: any) {
    Logger.error(`Erro no sistema ${e.message}`);
    return res.status(400).json({ error: e.message });
  }
}

export async function updateDistrib(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const data = req.body;
    const distrib = await prisma.distrib.update({
      where: { id: id },
      data: data,
    });
    return res.status(200).json(distrib);
  } catch (e: any) {
    Logger.error(`Erro no sistema ${e.message}`);
    return res.status(400).json({ error: e.message });
  }
}

export async function deleteDistrib(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    // const distrib = await prisma.distrib.update({
    //   where: { id: id },
    //   data: {
    //     deletedAt: new Date(),
    //   },
    // });
    const distrib = await prisma.distrib.delete({
      where: { id: id },
    });
    return res.status(200).json(distrib);
  } catch (e: any) {
    Logger.error(`Erro no sistema ${e.message}`);
    return res.status(400).json({ error: e.message });
  }
}
