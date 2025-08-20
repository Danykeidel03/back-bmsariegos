const { createRivalTeam, getRivalTeams } = require("../services/rivalTeamManage");

const rivalTeamController = {
    createRivalTeam:
        async (request, response) => {
            try {
                const { name } = request.body;
                const photoBuffer = request.file ? request.file.buffer : null;
                
                const data = await createRivalTeam({ name, photoBuffer });
                
                if (data.code === 11001) {
                    return response.status(400).json({ message: "Foto no válida", code: 11001 });
                }
                
                return response.status(201).json({
                    status: 201,
                    message: 'Rival team created successfully',
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
    getRivalTeams:
        async (request, response) => {
            try {
                const data = await getRivalTeams();
                return response.status(200).json({
                    status: 200,
                    message: 'success',
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
        }
}

module.exports = rivalTeamController;