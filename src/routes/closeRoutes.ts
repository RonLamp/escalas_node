import { Router } from "express";
import { validateJWT } from "../middleware/jwtValidations";
import {
  idParamValidation,
  idParamGroupValidation,
  validate,
} from "../middleware/handleValidation";

import {
  getUsers,
  getUser,
  getUsersSelect,
  createUser,
  updateUser,
  deleteUser,
  createUserCommon,
} from "../controllers/userControllers";
import {
  userOwnerValidation,
  userCommonValidation,
} from "../middleware/userValidation";

import {
  getProfisss,
  getProfiss,
  getProfisssSelect,
  getProfisssGroup,
  createProfiss,
  updateProfiss,
  deleteProfiss,
} from "../controllers/profissControllers";
import { profissValidation } from "../middleware/profissValidation";

import {
  getGroups,
  getGroup,
  getGroupsSelect,
  createGroup,
  updateGroup,
  deleteGroup,
} from "../controllers/groupControllers";
import { groupValidation } from "../middleware/groupValidation";

import {
  getScales,
  getScale,
  getScalesSelect,
  getScalesBygroup,
  createScale,
  updateScale,
  deleteScale,
} from "../controllers/scaleControllers";
import { scaleValidation } from "../middleware/scaleValidation";

import {
  getRelProfGroup,
  getRelProfsGroupByGroup,
  createRelProfGroupSome,
} from "../controllers/profgroupControllers";
import {
  profgroupValidation,
  relsprofgroupValidation, //relprofspecValidation,
} from "../middleware/profgroupValidation";

import {
  getRoles,
  getRole,
  getRolesSelect,
  createRole,
  updateRole,
  deleteRole,
} from "../controllers/roleControllers";
import { roleValidation } from "../middleware/roleValidation";
import { getNull } from "../controllers/authController";

import {
  distribDatesValidation,
  distribCreateValidation,
} from "../middleware/distribValidations";
import {
  getDistribs,
  createDistrib,
  deleteDistrib,
  updateDistrib,
} from "../controllers/distribControllers";
import { create } from "domain";

//---- Close Routes propriamente ditas -------------------------------------
// a chamada para close routes deve ser feita com o token no header
// e a definição de rotas deve ser feita com o prefixo /api oriunda de openRoutes
// app.use("/api", closeRoutes);

const closeRoutes = Router();
closeRoutes.use(validateJWT("Authorization"));
export default closeRoutes
  //--- auth routes  ----------------------------------------
  // Para verificar se o user está logado na página dashboard
  // atraves do token no header
  .get("/null", getNull)
  //.get("/null", idParamValidation(), validate, getNull)

  //--- users routes  ----------------------------------------
  .get("/users/:id", idParamValidation(), validate, getUsers)
  .get("/users/select/:id", idParamValidation(), validate, getUsersSelect)
  .get("/user/:id", idParamValidation(), validate, getUser)
  .post(
    "/user/:id",
    idParamValidation(),
    validate,
    userOwnerValidation(),
    validate,
    createUser
  )
  .post(
    "/userCommon/:id",
    idParamValidation(),
    validate,
    userCommonValidation(),
    validate,
    createUserCommon
  )
  .patch("/user/:id", idParamValidation(), validate, updateUser)
  .delete("/user/:id", idParamValidation(), validate, deleteUser)

  //--- roles routes  ----------------------------------------
  .get("/roles/:id", idParamValidation(), validate, getRoles)
  .get("/roles/select/:id", idParamValidation(), validate, getRolesSelect)
  .get("/role/:id", idParamValidation(), validate, getRole)
  .post(
    "/role/:id",
    idParamValidation(),
    validate,
    roleValidation(),
    validate,
    createRole
  )
  .patch("/role/:id", idParamValidation(), validate, updateRole)
  .delete("/role/:id", idParamValidation(), validate, deleteRole)

  //--- profisss routes  ---------------------------------------------------
  .get("/profisss", getProfisss)
  .get(
    "/profisss/group/:groupid",
    idParamGroupValidation(),
    validate,
    getProfisssGroup
  )
  .get("/profisss/select", getProfisssSelect)
  .get("/profiss/:id", idParamValidation(), validate, getProfiss)
  .post("/profiss", profissValidation(), validate, createProfiss)
  .patch("/profiss/:id", idParamValidation(), validate, updateProfiss)
  .delete("/profiss/:id", idParamValidation(), validate, deleteProfiss)

  //--- specialitys groups  ------------------------------------------------
  .get("/groups", getGroups)
  .get("/groups/select", getGroupsSelect)
  .get("/group/:id", idParamValidation(), validate, getGroup)
  .post("/group", groupValidation(), validate, createGroup)
  .patch("/group/:id", idParamValidation(), validate, updateGroup)
  .delete("/group/:id", idParamValidation(), validate, deleteGroup)

  //--- specialitys scales (Horários)  -------------------------------------
  .get("/scales", getScales)
  .get("/scales/select", getScalesSelect)
  .get(
    "/scales/group/:groupid",
    idParamGroupValidation(),
    validate,
    getScalesBygroup
  )
  .get("/scale/:id", idParamValidation(), validate, getScale)
  .post("/scale", scaleValidation(), validate, createScale)
  .patch("/scale/:id", idParamValidation(), validate, updateScale)
  .delete("/scale/:id", idParamValidation(), validate, deleteScale)

  //--- profsgroup routes  ----------------------------------------
  .get("/profsgroup/:id", idParamValidation(), validate, getRelProfGroup)
  .get(
    "/profsgroup/group/:groupid",
    idParamGroupValidation(),
    validate,
    getRelProfsGroupByGroup
  )
  .post(
    "/profsgroup/:groupid",
    idParamGroupValidation(),
    validate,
    relsprofgroupValidation(),
    validate,
    createRelProfGroupSome
  )

  //--- distrib ROUTES ------------------------------------------------------
  //--- (nestas routes estão aplicando o middleware de validação sem usar o
  //--- handleValidation para os parametros) --------------------------------
  .post("/distribs/:groupid", distribDatesValidation(), validate, getDistribs)
  .post("/distrib/", distribCreateValidation(), validate, createDistrib)
  .delete("/distrib/:id", idParamValidation(), validate, deleteDistrib)
  .patch("/distrib/:id", idParamValidation(), validate, updateDistrib);

// Middleware para lidar com rotas não encontradas
closeRoutes.use((req, res) => {
  res.status(404).json({ message: "Rota não encontrada" });
});
