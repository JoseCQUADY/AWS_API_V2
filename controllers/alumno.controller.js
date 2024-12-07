
import prisma from "../lib/prismaConn.js";
import { uploadFile } from "../lib/s3.js";
import {sessionLogin,sessionLogout,getSessionString} from "../lib/dynamoDB.js";
import crypto, { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
import { PublishCommand } from "@aws-sdk/client-sns";
import { client } from "../lib/sns.js";
import { AWS_TOPIC_ARN } from "../lib/config.js";


export const createAlumno = async (req, res) => {
 
    const newAlumno = await prisma.alumno.create({
        data: {
            nombres: req.body.nombres,
            apellidos: req.body.apellidos,
            matricula: req.body.matricula,
            fotoPerfilUrl: null,
            promedio: req.body.promedio,
            password: await bcrypt.hash(req.body.password, 10)
        }
    });
    res.status(201).json(newAlumno);
};

export const createProfilePicture = async (req, res) => {
    const { id } = req.params;
    const numericId = Number(id);
    const result = await uploadFile(req.files.foto)
    res.status(200).json({ fotoPerfilUrl: result });
    
    await prisma.alumno.update({
        where: {
            id:  numericId
        },
        data: {
            fotoPerfilUrl: result
        }
    });
};

export const getAlumnos = async (req, res) => {
    const alumnos = await prisma.alumno.findMany();
    res.status(200).json(alumnos);
};

export const getAlumnosById = async (req, res) => {
    const { id } = req.params;
    const numericId = Number(id);
    const alumno = await prisma.alumno.findUnique({
        where: {
            id: numericId
        }
    });
    if (!alumno) {
        return res.status(404).json({ error: 'Alumno not found' });
    }
    res.status(200).json(alumno);
}

export const deleteAlumno = async (req, res) => {
    try {
        const { id } = req.params;
        const numericId = Number(id);

        const alumno = await prisma.alumno.delete({
            where: {
                id: numericId
            }
        })

        if (!alumno) {
            return res.status(404).json({ error: 'Alumno not found' });
        }
        res.status(200).json({ message: 'Alumno deleted successfully' });

    } catch (error) {
        return res.status(404).json({ error: 'Alumno not found' });
    }
};

export const updateAlumno = async (req, res) => {
    try {
        const { id } = req.params;
        const numericId = Number(id);

        const { nombres, apellidos, matricula, promedio } = req.body;

        const alumno = await prisma.alumno.update({
            where: {
                id: numericId
            },
            data: {
                nombres,
                apellidos,
                matricula,
                promedio
            }
        });

        if (!alumno) {
            return res.status(404).json({ error: 'Alumno not found' });
        }

        res.status(200).json(alumno);

    } catch (error) {
        res.status(500).json({ error: "Upps! Something went wrong, try again!!" });
    }

};

export const loginAlumno = async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;
  
        const alumno = await prisma.alumno.findUnique({
            where: {
                id: parseInt(id)
            }
            });
      
        if (!alumno) {
          return res.status(400).json({ error: 'Alumno not found' });
        }
  
        const isValidPassword = await bcrypt.compare(password, alumno.password);

        if (!isValidPassword) {
            return res.status(400).json({ error: 'Invalid password' });
        }
  
        const sessionData = {
          id: randomUUID(),
          fecha: Math.floor(Date.now() / 1000),
          alumnoId: id,
          active: true,
          sessionString: crypto.randomBytes(64).toString('hex')
        }
        
        const result = await sessionLogin(sessionData);
  
        res.status(200).json({sessionString: sessionData.sessionString}); 

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  export const logoutAlumno = async (req, res) => {
    try {
        const { id } = req.params;
        const { sessionString } = req.body;
  
        const alumno = prisma.alumno.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        if (!alumno) {
            return res.status(404).json({ error: 'Alumno not found' });
          }

        const userData = await getSessionString(sessionString);

        if (!userData) {
          return res.status(404).json({ error: 'Session not found' });
        }

        const sessionData = {
            id: userData.id.S,
            fecha: parseInt(userData.fecha.N),
            alumnoId: userData.alumnoId.S,
            active: false,
            sessionString: userData.sessionString.S 
          }
          
        const result = await sessionLogout(sessionData);
        
        res.status(200).json({message: 'Session closed successfully'}); 

    } catch (error) {
      res.status(500).json({ error: error.message });
    }   
    };

    export const getAlumnoBySession = async (req, res) => {
        try {
            const { id } = req.params;
            const {sessionString} = req.body
            const session = await getSessionString(sessionString);
            session ? res.status(200).json({
                Data: "Nice to see you again"
            }) : res.status(400).json({ error: 'Session not found' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };


    export const sendEmail = async (req, res) => {
        
        const { id } = req.params;
        const alumno = await prisma.alumno.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        if (!alumno) {
            return res.status(404).json({ error: 'Alumno not found' });
        }

        const status = alumno.promedio >= 7.0 ? 'Aprobado' : 'Reprobado';
       
        const params = {
            Message: `Alumno: ${alumno.nombres} ${alumno.apellidos}, su promedio es de : ${alumno.promedio}.
            Usted ha sido ${status}`,
            TopicArn: AWS_TOPIC_ARN,
            protocol: "email",
        };


        try {
            const command = new PublishCommand(params);
            const data  = await client.send(command);
            res.status(200).json({message: 'Email sent successfully'});
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }