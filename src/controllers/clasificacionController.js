const scrapingService = require('../services/scrapingService');
const cacheService = require('../services/cacheService');

const clasificacionController = {
    getClasificacionByTeam: async (request, response) => {
        try {
            const { teamId } = request.params;
            const data = await scrapingService.getClasificacionByTeam(teamId);
            
            return response.status(200).json({
                status: 200,
                message: 'Clasificación obtenida exitosamente',
                data: data
            });
        } catch (error) {
            console.log(error);
            response.status(500).json({
                status: 500,
                message: 'Error al obtener la clasificación',
                data: error.message
            });
        }
    },

    getAllClasificaciones: async (request, response) => {
        try {
            let data = cacheService.get('all-clasificaciones');
            
            if (!data) {
                data = await scrapingService.getAllClasificaciones();
                cacheService.set('all-clasificaciones', data);
            }
            
            return response.status(200).json({
                status: 200,
                message: 'Todas las clasificaciones obtenidas exitosamente',
                data: data
            });
        } catch (error) {
            console.log(error);
            response.status(500).json({
                status: 500,
                message: 'Error al obtener las clasificaciones',
                data: error.message
            });
        }
    }
};

module.exports = clasificacionController;