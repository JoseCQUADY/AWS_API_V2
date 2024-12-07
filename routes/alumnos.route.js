import express from 'express';
import { createAlumno, getAlumnos, deleteAlumno, getAlumnosById, updateAlumno,createProfilePicture, loginAlumno,getAlumnoBySession,logoutAlumno,sendEmail} from '../controllers/alumno.controller.js';
import { alumnoDataValidatebyBody, alumnoDataValidatebyParams } from '../validations/alumnos.validation.js';

const router = express.Router();

router.get('/alumnos', getAlumnos);

router.get('/alumnos/:id', alumnoDataValidatebyParams, getAlumnosById);

router.post('/alumnos/:id/session/verify', getAlumnoBySession);

router.post('/alumnos/:id/fotoPerfil', createProfilePicture)

router.post('/alumnos', alumnoDataValidatebyBody, createAlumno);

router.post('/alumnos/:id/session/login', loginAlumno);

router.post('/alumnos/:id/session/logout', logoutAlumno);

router.post('/alumnos/:id/email',sendEmail)

router.put('/alumnos/:id', alumnoDataValidatebyBody, alumnoDataValidatebyParams, updateAlumno);

router.delete('/alumnos/:id', alumnoDataValidatebyParams, deleteAlumno);

router.route('/alumnos')
    .all((req, res) => {
        res.status(405).json({ error: "Method Not Allowed" });
    });

router.route('/alumnos/:id')
    .all((req, res) => {
        res.status(405).json({ error: "Method Not Allowed" });
    });


export default router;
