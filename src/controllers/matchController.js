const { createMatch, getMatches, updateMatch } = require("../services/matchManage");

const matchController = {
    createMatch:
        async (request, response) => {
            try {
                const { rivalTeam, ownTeam, date, time, location } = request.body;
                
                const data = await createMatch({ rivalTeam, ownTeam, date, time, location });
                
                return response.status(201).json({
                    status: 201,
                    message: 'Match created successfully',
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
    getMatches:
        async (request, response) => {
            try {
                const data = await getMatches();
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
    updateMatch:
        async (request, response) => {
            try {
                const { id } = request.params;
                const { result, completed } = request.body;
                
                const data = await updateMatch(id, { result, completed });
                
                if (!data) {
                    return response.status(404).json({
                        status: 404,
                        message: 'Match not found'
                    });
                }
                
                return response.status(200).json({
                    status: 200,
                    message: 'Match updated successfully',
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

module.exports = matchController;