import { body, param } from "express-validator";

export const distribDatesValidation = () => {
  return [
    param("groupid")
      .isString()
      .withMessage("O id é obrigatorio")
      .isUUID()
      .withMessage("O id é inválido"),
    body("dataIni")
      .isISO8601()
      .withMessage(
        "A data deve estar no formato ISO 8601 (exemplo: 2023-08-24T12:34:56.789Z)"
      ),
    body("dataFim")
      .isISO8601()
      .withMessage(
        "A data deve estar no formato ISO 8601 (exemplo: 2023-08-24T12:34:56.789Z)"
      ),
  ];
};

export const distribCreateValidation = () => {
  return [
    body("data")
      .isISO8601()
      .withMessage(
        "A data deve estar no formato ISO 8601 (exemplo: 2023-08-24T12:34:56.789Z)"
      ),
    body("obs")
      .isString()
      .withMessage("A observação deve ser um texto")
      .isLength({ max: 30 })
      .withMessage("A observação deve ter no máximo 30 caracteres")
      .optional({ nullable: true }),
    body("profiss_Id")
      .isString()
      .withMessage("O profissional é obrigatorio")
      .isUUID()
      .withMessage("O profissional é inválido"),
    body("group_Id")
      .isString()
      .withMessage("O grupo é obrigatorio")
      .isUUID()
      .withMessage("O grupo é inválido"),
    body("scale_Id")
      .isString()
      .withMessage("A escala é obrigatorio")
      .isUUID()
      .withMessage("A escala é inválido"),
  ];
};

export const distribUpdateValidation = () => {
  return [
    body("data")
      .isISO8601()
      .withMessage(
        "A data deve estar no formato ISO 8601 (exemplo: 2023-08-24T12:34:56.789Z)"
      ),
    body("obs")
      .isString()
      .withMessage("A observação deve ser um texto")
      .isLength({ max: 30 })
      .withMessage("A observação deve ter no máximo 30 caracteres")
      .optional({ nullable: true }),
    body("profiss_Id")
      .isString()
      .withMessage("O profissional é obrigatorio")
      .isUUID()
      .withMessage("O profissional é inválido"),
    body("group_Id")
      .isString()
      .withMessage("O grupo é obrigatorio")
      .isUUID()
      .withMessage("O grupo é inválido"),
    body("scale_Id")
      .isString()
      .withMessage("A escala é obrigatorio")
      .isUUID()
      .withMessage("A escala é inválido"),
  ];
};

/* interface IDistribProps {
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
*/

//https://github.com/prisma/prisma/discussions/11443
