import { body, param, validationResult } from "express-validator";

export const profesorDataValidatebyBody = [
    body("nombres")
        .exists({ checkFalsy: true })
        .withMessage("Nombre is required"),
        
    body("apellidos")
        .exists({ checkFalsy: true })
        .withMessage("Apellidos is required"),

    body("horasClase")
        .exists({ checkFalsy: true })
        .withMessage("Horas de clase is required"),

    body("numeroEmpleado")
        .exists({ checkFalsy: true })
        .withMessage("Numero de empleado is required"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())

            return res.status(400).json({ error: errors.array().map((error) => error.msg) });
        next();
    },
];

export const profesorDataValidatebyParams = [
    param("id")
        .exists({ checkFalsy: true }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ error: errors.array().map((error) => error.msg) });
        next();
    },
];