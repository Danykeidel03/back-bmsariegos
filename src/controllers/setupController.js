const Team = require('../models/Team');

const equipoUrls = {
    'COESA BM SARIEGOS': 'https://resultadosbalonmano.isquad.es/clasificacion.php?seleccion=0&id=1032278&jornada=22',
    'MOLOKO BM SARIEGOS': 'https://resultadosbalonmano.isquad.es/clasificacion.php?seleccion=0&id=1032571',
    'CASA DEL PUEBLO BMS ZARDINO ': 'https://resultadosbalonmano.isquad.es/clasificacion.php?seleccion=0&id=1032571',
    'HOTEL ALFAGEME BM SARIEGOS': 'https://resultadosbalonmano.isquad.es/clasificacion.php?seleccion=0&id=1032295',
    'INGESAN BM SARIEGOS': 'https://resultadosbalonmano.isquad.es/clasificacion.php?seleccion=0&id=1032297',
    'ARTESANIAS LUYMA BM SARIEGOS': 'https://resultadosbalonmano.isquad.es/clasificacion.php?seleccion=0&id=1032304',
    'CLINICA DENTAL SILVA CIDEO': 'https://resultadosbalonmano.isquad.es/clasificacion.php?seleccion=0&id=1032305',
    'ELECTRICIDAD PANTOJA BM SARIEGOS': 'https://resultadosbalonmano.isquad.es/clasificacion.php?seleccion=0&id=1032300',
    'DIDACTICA LEONESA BM SARIEGOS': 'https://resultadosbalonmano.isquad.es/clasificacion.php?seleccion=0&id=1032307',
    ' ILEON.COM BM SARIEGOS': 'https://resultadosbalonmano.isquad.es/clasificacion.php?seleccion=0&id=1032308',
    'FERRETERIA EL CRUCERO BM SARIEGOS': 'https://resultadosbalonmano.isquad.es/clasificacion.php?seleccion=0&id=1032302',
    'FISIOPAT BM SARIEGOS': 'https://resultadosbalonmano.isquad.es/clasificacion.php?seleccion=0&id=1032296'
};

const setupController = {
    setupClasificaciones: async (request, response) => {
        const timeout = setTimeout(() => {
            if (!response.headersSent) {
                response.status(408).json({ message: 'Request timeout' });
            }
        }, 25000);
        
        try {
            console.log('Iniciando setup clasificaciones...');
            const teams = await Team.find({}).maxTimeMS(10000);
            console.log(`Encontrados ${teams.length} equipos`);
            
            const results = [];
            
            for (const team of teams) {
                const url = equipoUrls[team.name];
                
                if (url) {
                    await Team.findByIdAndUpdate(team._id, { clasificacionUrl: url }).maxTimeMS(5000);
                    results.push({ team: team.name, status: 'configured' });
                } else {
                    results.push({ team: team.name, status: 'no_url_found' });
                }
            }
            
            clearTimeout(timeout);
            return response.status(200).json({
                status: 200,
                message: 'Setup completed',
                data: results
            });
        } catch (error) {
            clearTimeout(timeout);
            console.error('Error en setup:', error);
            if (!response.headersSent) {
                response.status(500).json({
                    status: 500,
                    message: 'Setup failed',
                    error: error.message
                });
            }
        }
    }
};

module.exports = setupController;