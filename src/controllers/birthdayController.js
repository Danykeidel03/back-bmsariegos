const { getDates, createBirthday, updatePlayer, getAllBirthdays, deleteBirthday } = require("../services/birthdayManage");

const birthdayController = {
    getBirthdays:
        async (request, response) => {
            try {
                let data = await getDates()
                if (data) {
                    return response.status(200).json({
                        status: 200,
                        message: 'success',
                        data: data
                    })
                }
            } catch (e) {
                console.log(e)
                response.status(500).json({
                    status: 500,
                    message: 'error',
                    data: e
                })
            }
        },
    createBirthday:
        async (request, response) => {
            try {
                console.log('Request body:', request.body);
                console.log('Request file:', request.file);
                const { name, dni, birthDay, category } = request.body;
                const photoBuffer = request.file ? request.file.buffer : null;
                
                const data = await createBirthday({ name, dni, birthDay, category, photoBuffer });
                
                if (data.code === 11001) {
                    return response.status(400).json({ message: "Foto no válida", code: 11001 });
                }
                
                return response.status(201).json({
                    status: 201,
                    message: 'Birthday created successfully',
                    data: data
                });
            } catch (e) {
                console.log(e)
                response.status(500).json({
                    status: 500,
                    message: 'error',
                    data: e.message
                })
            }
        },

    updatePlayer: 
        async (request, response) => {
            try {
                const { id } = request.params;
                const { name, dni, birthDay, category } = request.body;
                const photoBuffer = request.file ? request.file.buffer : null;

                const data = await updatePlayer(id, { name, dni, birthDay, category, photoBuffer});

                if (data.code === 11001) {
                    return response.status(400).json({ message: "Foto no válida", code: 11001 });
                }

                if (data.code === 404) {
                    return response.status(404).json({ message: "Jugador no encontrado", code: 404 });
                }

                return response.status(200).json({
                    status: 200,
                    message: 'Player updated successfully',
                    data: data
                });
            } catch (e) {
                console.log(e)
                response.status(500).json({
                    status: 500,
                    message: 'error',
                    data: e.message
                })
            }
        },

    getAllBirthdays:
        async (request, response) => {
            try {
                const data = await getAllBirthdays();
                return response.status(200).json({
                    status: 200,
                    message: 'success',
                    data: data
                });
            } catch (e) {
                console.log(e)
                return response.status(500).json({
                    status: 500,
                    message: 'error',
                    data: e.message
                })
            }
        },

    deleteBirthday:
        async (request, response) => {
            try {
                const { id } = request.params;
                const data = await deleteBirthday(id);
                
                if (!data) {
                    return response.status(404).json({
                        status: 404,
                        message: 'Birthday not found'
                    });
                }
                
                return response.status(200).json({
                    status: 200,
                    message: 'Birthday deleted successfully',
                    data: data
                });
            } catch (e) {
                console.log(e)
                return response.status(500).json({
                    status: 500,
                    message: 'error',
                    data: e.message
                })
            }
        },
}

module.exports = birthdayController;
