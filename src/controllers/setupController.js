const Team = require('../models/Team');

const equipoUrls = {
    'COESA BM SARIEGOS': 'https://resultadosbalonmano.isquad.es/clasificacion.php?seleccion=0&id_superficie=1&id_categoria=2551&id_competicion=209409&id_temp=2526&id_ambito=19&id_territorial=36',
    'MOLOKO BM SARIEGOS': 'https://resultadosbalonmano.isquad.es/clasificacion.php?seleccion=0&id_superficie=1&id_categoria=2551&id_competicion=209410&id_temp=2526&id_ambito=19&id_territorial=36',
    'CASA DEL PUEBLO BMS ZARDINO ': 'https://resultadosbalonmano.isquad.es/clasificacion.php?seleccion=0&id_superficie=1&id_categoria=2551&id_competicion=209410&id_temp=2526&id_ambito=19&id_territorial=36',
    'HOTEL ALFAGEME BM SARIEGOS': 'https://resultadosbalonmano.isquad.es/clasificacion.php?seleccion=0&id_superficie=1&id_categoria=2551&id_competicion=209412&id_temp=2526&id_ambito=19&id_territorial=36',
    'INGESAN BM SARIEGOS': 'https://resultadosbalonmano.isquad.es/clasificacion.php?seleccion=0&id_superficie=1&id_categoria=2551&id_competicion=209411&id_temp=2526&id_ambito=19&id_territorial=36',
    'ARTESANIAS LUYMA BM SARIEGOS': 'https://resultadosbalonmano.isquad.es/clasificacion.php?seleccion=0&id_superficie=1&id_categoria=2551&id_competicion=209428&id_temp=2526&id_ambito=19&id_territorial=36',
    'CLINICA DENTAL SILVA CIDEO': 'https://resultadosbalonmano.isquad.es/clasificacion.php?seleccion=0&id_superficie=1&id=1032305&jornada=2&id_ambito=19',
    'ELECTRICIDAD PANTOJA BM SARIEGOS': 'https://resultadosbalonmano.isquad.es/clasificacion.php?seleccion=0&id_superficie=1&id_categoria=2551&id_competicion=209413&id_temp=2526&id_ambito=19&id_territorial=36',
    'DIDACTICA LEONESA BM SARIEGOS': 'https://resultadosbalonmano.isquad.es/clasificacion.php?seleccion=0&id_superficie=1&id_categoria=2551&id_competicion=209430&id_temp=2526&id_ambito=19&id_territorial=36',
    ' ILEON.COM BM SARIEGOS': 'https://resultadosbalonmano.isquad.es/clasificacion.php?seleccion=0&id_superficie=1&id_categoria=2551&id_competicion=209430&id=1032308&id_temp=2526&id_territorial=36&id_ambito=19',
    'FERRETERIA EL CRUCERO BM SARIEGOS': 'https://resultadosbalonmano.isquad.es/clasificacion.php?seleccion=0&id_superficie=1&id_categoria=2551&id_competicion=209429&id_temp=2526&id_ambito=19&id_territorial=36',
    'FISIOPAT BM SARIEGOS': 'https://resultadosbalonmano.isquad.es/clasificacion.php?seleccion=0&id_superficie=1&id_categoria=2551&id_competicion=209399&id_temp=2526&id_ambito=19&id_territorial=36'
};

const setupController = {
    setupClasificaciones: async (request, response) => {
        try {
            const teams = await Team.find({});
            const results = [];
            
            for (const team of teams) {
                const url = equipoUrls[team.name];
                
                if (url) {
                    await Team.findByIdAndUpdate(team._id, { clasificacionUrl: url });
                    results.push({ team: team.name, status: 'configured' });
                } else {
                    results.push({ team: team.name, status: 'no_url_found' });
                }
            }
            
            return response.status(200).json({
                status: 200,
                message: 'Setup completed',
                data: results
            });
        } catch (error) {
            console.log(error);
            response.status(500).json({
                status: 500,
                message: 'Setup failed',
                data: error.message
            });
        }
    }
};

module.exports = setupController;