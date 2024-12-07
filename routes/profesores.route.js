import express from 'express';
import { createProfesor,getProfesores,getProfesorById,updateProfesor ,deleteProfesor} from '../controllers/profesor.controller.js';
import { profesorDataValidatebyBody,profesorDataValidatebyParams } from '../validations/profesores.validation.js';

const router = express.Router();

router.get('/profesores', getProfesores);

router.get('/profesores/:id', profesorDataValidatebyParams,getProfesorById);

router.post('/profesores', profesorDataValidatebyBody,createProfesor);

router.put('/profesores/:id', profesorDataValidatebyBody,profesorDataValidatebyParams,updateProfesor);

router.delete('/profesores/:id', profesorDataValidatebyParams,deleteProfesor);

router.route('/profesores')
    .all((req, res) => {
        res.status(405).json({ error: "Method Not Allowed" });
    });

router.route('/profesores/:id')
    .all((req, res) => {
        res.status(405).json({ error: "Method Not Allowed" });
    });




export default router;
