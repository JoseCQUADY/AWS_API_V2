import { body, param, validationResult } from "express-validator";

export const alumnoDataValidatebyBody = [
    body("nombres")
        .exists({ checkFalsy: true })
        .withMessage("El campo 'nombre' es requerido."),
        // .isString()
        // .withMessage("El campo 'nombre' debe ser una cadena de texto."),

    body("apellidos")
        .exists({ checkFalsy: true })
        .withMessage("El campo 'apellidos' es requerido."),
        // .isString()
        // .withMessage("El campo 'apellidos' debe ser una cadena de texto."),

    // body("matricula")
    //     .exists({ checkFalsy: true })
    //     .withMessage("El campo 'matricula' es requerido.")
    //     .isString()
    //     .withMessage("El campo 'matricula' debe ser una cadena numérica.")
    //     .isNumeric()
    //     .withMessage("El campo 'matricula' debe contener solo números."),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array().map((error) => error.msg) });
        next();
    },
];

export const alumnoDataValidatebyParams = [
    param("id")
        .exists({ checkFalsy: true })
        .withMessage("El campo 'id' es requerido."),
        // .isString()
        // .withMessage("El campo 'id' debe ser una cadena de texto."),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array().map((error) => error.msg) });
        next();
    },
];