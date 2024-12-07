import prisma from "../lib/prismaConn.js";


export const createProfesor = async (req, res) => {
    try {
        const {numeroEmpleado,nombres, apellidos, horasClase } = req.body;
    
       const newProfesor = await prisma.profesor.create({
        data: {
            nombres: nombres,
            apellidos: apellidos,
            numeroEmpleado: parseInt(numeroEmpleado),
            horasClase: parseInt(horasClase)
        }
    });
        res.status(201).json(newProfesor);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getProfesores = async (req, res) => {
    const profesores = await prisma.profesor.findMany();
    res.status(200).json(profesores);
};

export const getProfesorById= async (req, res) => {
    const { id } = req.params;
    const numericId = Number(id);
    const profesor = await prisma.profesor.findUnique({
        where: {
            id: numericId
        }
    });
    if (!profesor) {
        return res.status(404).json({ error: 'Profesor not found' });
    }
    res.status(200).json(profesor);
}

export const deleteProfesor = async (req, res) => {
    try {
        const { id } = req.params;
        const numericId = Number(id);
        const profesor = await prisma.profesor.delete({
            where: {
                id: numericId
            }
        })
        if (!profesor) {
            return res.status(404).json({ error: 'Profesor not found' });
        }
        res.status(200).json({ message: 'Profesor deleted successfully' });
    } catch (error) {
        return res.status(404).json({ error: 'Profesor not found' });
    }
    
};

export const updateProfesor = async (req, res) => {
    try {
        const { id } = req.params;
        const numericId = Number(id);

        const {numeroEmpleado,nombres, apellidos, horasClase } = req.body;

        const profesor = await prisma.profesor.update({
            where: {
                id: numericId
            },
            data: {
                nombres,
                apellidos,
                numeroEmpleado: parseInt(numeroEmpleado),
                horasClase: parseInt(horasClase)
            }
        });

        if (!profesor) {
            return res.status(404).json({ error: 'Profesor not found' });
        }

        res.status(200).json(profesor);

    } catch (error) {
        res.status(500).json({ error: "Upps! Something went wrong, try again!!" });
    }


};
