const { parse } = require('csv-parse/sync');
const { getDates, createBirthday, updatePlayer, getAllBirthdays, deleteBirthday, importPlayersFromCsv, wipeRoster } = require("../services/birthdayManage");

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

    importCsv:
        async (request, response) => {
            try {
                if (!request.file) {
                    return response.status(400).json({
                        status: 400,
                        message: 'No se recibió ningún archivo CSV'
                    });
                }

                let rows;
                try {
                    rows = parse(request.file.buffer.toString('utf-8'), {
                        columns: true,
                        skip_empty_lines: true,
                        bom: true
                    });
                } catch {
                    return response.status(400).json({
                        status: 400,
                        message: 'El archivo no es un CSV válido'
                    });
                }

                const summary = await importPlayersFromCsv(rows);

                return response.status(200).json({
                    status: 200,
                    message: 'Importación completada',
                    data: summary
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

    wipeRoster:
        async (request, response) => {
            try {
                const data = await wipeRoster();

                return response.status(200).json({
                    status: 200,
                    message: 'Players and teams deleted successfully',
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
