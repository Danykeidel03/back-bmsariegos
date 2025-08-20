const { createTeam, getTeams } = require("../services/teamManage");

const teamController = {
    createTeam:
        async (request, response) => {
            try {
                const { name, category, division } = request.body;
                
                const data = await createTeam({ name, category, division });
                
                return response.status(201).json({
                    status: 201,
                    message: 'Team created successfully',
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
    getTeams:
        async (request, response) => {
            try {
                const data = await getTeams();
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

module.exports = teamController;