import { Request, Response } from "express";
import Logger from "../resources/logger";
import prisma from "../resources/prisma";
// import dayjs from "dayjs";
// import { IsDateOptions } from "express-validator/src/options";

interface IProfProps {
  nome: string;
  crm: string;
  diaTurno: string;
  horas: number;
}
interface ProfissionalTurno {
  nome: string;
  crm: string;
  totalHoras: number;
  diasTurno: string[];
}

// Função para calcular o total de horas entre duas datas
function calcularTotalHoras(start: Date, end: Date): number {
  const diff = Math.abs(end.getTime() - start.getTime());
  const totalHoras = Math.ceil(diff / (60 * 60 * 1000));
  return totalHoras;
}

// Função para aplanar o array de objetos
function aplanarDados(objetos) {
  const resultado: IProfProps[] = [];

  objetos.forEach((item) => {
    const profissional = item.profiss;
    const escala = item.scale;
    const data = new Date(item.data);
    const diaDoMes = data.getDate().toString().padStart(2, "0");
    const turno =
      new Date(escala.start).getHours() >= 19 - 3
        ? "N"
        : new Date(escala.start).getHours() >= 13 - 3
          ? "T"
          : "D";
    const diaTurno = `${diaDoMes}(${turno})`;
    const totalHoras = calcularTotalHoras(
      new Date(escala.start),
      new Date(escala.end)
    );
    // Adicionar ao resultado final
    resultado.push({
      nome: profissional.name,
      crm: profissional.crm,
      diaTurno: diaTurno,
      horas: totalHoras,
    });
  });

  return resultado;
}

function agruparPorProfissional(dados: any[]): ProfissionalTurno[] {
  const profissionais: { [key: string]: ProfissionalTurno } = {};
  // Itera sobre os dados e agrupa por nome e CRM
  dados.forEach((item) => {
    const chave = `${item.nome}_${item.crm}`;
    if (!profissionais[chave]) {
      profissionais[chave] = {
        nome: item.nome,
        crm: item.crm,
        totalHoras: 0,
        diasTurno: [],
      };
    }
    // Soma as horas ao total de horas
    profissionais[chave].totalHoras += item.horas;
    // Adiciona o dia do turno ao array
    profissionais[chave].diasTurno.push(item.diaTurno);
  });
  // Converte o objeto em um array
  const resultado: ProfissionalTurno[] = Object.values(profissionais);

  return resultado;
}

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
        data: true,
        obs: false,
        profiss: {
          select: {
            id: false,
            name: true,
            crm: true,
            alocacao: false,
          },
        },
        scale: {
          select: {
            id: false,
            name: false,
            start: true,
            end: true,
          },
        },
      },
    });

    const efetividadeAplanada = aplanarDados(efetividade);
    const resultadoAgrupado = agruparPorProfissional(efetividadeAplanada);

    return res.status(200).json(resultadoAgrupado);
  } catch (e: any) {
    Logger.error(`Erro no sistema ${e.message}`);
    return res.status(400).json({ error: e.message });
  }
}
