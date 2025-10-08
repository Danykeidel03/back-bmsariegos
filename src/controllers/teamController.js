const { createTeam, getTeams, deleteTeam, updateTeamName, reorderTeams } = require("../services/teamManage");

const teamController = {
    createTeam:
        async (request, response) => {
            try {
                const { name, category, division, clasificacionUrl } = request.body;
                
                const data = await createTeam({ name, category, division, clasificacionUrl });
                
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
        },
    deleteTeam:
        async (request, response) => {
            try {
                const { id } = request.params;
                const data = await deleteTeam(id);
                
                if (!data) {
                    return response.status(404).json({
                        status: 404,
                        message: 'Team not found'
                    });
                }
                
                return response.status(200).json({
                    status: 200,
                    message: 'Team deleted successfully',
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
    updateTeamName:
        async (request, response) => {
            try {
                const { id } = request.params;
                const { name } = request.body;
                
                const data = await updateTeamName(id, { name });
                
                if (!data) {
                    return response.status(404).json({
                        status: 404,
                        message: 'Team not found'
                    });
                }
                
                return response.status(200).json({
                    status: 200,
                    message: 'Team name updated successfully',
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
    reorderTeams:
        async (request, response) => {
            try {
                const { teamOrders } = request.body;
                
                const data = await reorderTeams(teamOrders);
                
                return response.status(200).json({
                    status: 200,
                    message: 'Teams reordered successfully',
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
    
    updateClasificacionUrl:
        async (request, response) => {
            try {
                const { id } = request.params;
                const { clasificacionUrl } = request.body;
                
                const Team = require('../models/Team');
                const data = await Team.findByIdAndUpdate(id, { clasificacionUrl }, { new: true });
                
                if (!data) {
                    return response.status(404).json({
                        status: 404,
                        message: 'Team not found'
                    });
                }
                
                return response.status(200).json({
                    status: 200,
                    message: 'Classification URL updated successfully',
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