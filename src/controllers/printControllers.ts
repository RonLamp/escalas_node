import { Request, Response } from "express";
import Logger from "../resources/logger";
import prisma from "../resources/prisma";
import dayjs from "dayjs";

export async function getPrints(req: Request, res: Response) {
  try {
    const groupid = req.params.groupid as string;
    const alocid = req.params.alocid as string;
    const dataIni = req.body.dataIni as string;
    const dataFim = req.body.dataFim as string;
    //console.log('we are here');
    const efetividade = await prisma.distrib.findMany({
      where: {
        group_Id: groupid,
        data: {
          gte: dataIni,
          lte: dataFim,
        },
        profiss: {
          alocacao: alocid,
        },
        deletedAt: null,
      },
      select: {
        id: false,
        data: false,
        obs: false,
        profiss: {
          select: {
            id: false,
            name: true,
            crm: true,
            alocacao: false,
          },
        },
      },
    });
    //console.log(distribs);
    // Transformação para o formato planificado
    // const distribsT: IDistribsProps[] = distribs.map((item) => ({
    //   id: item.id,
    //   data: item.data,
    //   dia: dayjs(item.data).format("DD"),
    //   mes: dayjs(item.data).format("MM"),
    //   obs: item.obs,
    //   color: item.profiss?.relprofgroups[0]?.color,
    //   profiss_id: item.profiss?.id,
    //   profiss_name: item.profiss?.name,
    //   scale_id: item.scale.id,
    //   scale_name: item.scale.name,
    // }));
    //console.log(distribsT);
    return res.status(200).json(efetividade);
  } catch (e: any) {
    Logger.error(`Erro no sistema ${e.message}`);
    return res.status(400).json({ error: e.message });
  }
}
