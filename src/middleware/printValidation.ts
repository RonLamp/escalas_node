import { body, param } from "express-validator";

export const printValidation = () => {
  return [
    param("groupid")
      .isString()
      .withMessage("O groupid é obrigatorio")
      .isUUID()
      .withMessage("O groupid é inválido"),
    param("alocid").isString().withMessage("O alocid é obrigatorio"),
    //   .isUUID()
    //   .withMessage("O alocid é inválido"),
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
