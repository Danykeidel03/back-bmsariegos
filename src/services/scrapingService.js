const axios = require('axios');
const cheerio = require('cheerio');
const { getTeams } = require('./teamManage');

const scrapingService = {
    async getClasificacionByTeam(teamId) {
        try {
            const teams = await getTeams();
            const team = teams.find(t => t._id.toString() === teamId);
            
            if (!team || !team.clasificacionUrl) {
                throw new Error('Team not found or no classification URL');
            }

            return await this.scrapeClasificacion(team.clasificacionUrl);
        } catch (error) {
            throw new Error(`Error getting team classification: ${error.message}`);
        }
    },

    async getAllClasificaciones() {
        try {
            const teams = await getTeams();
            const clasificaciones = {};

            for (const team of teams) {
                if (team.clasificacionUrl) {
                    try {
                        clasificaciones[team._id] = {
                            teamName: team.name,
                            category: team.category,
                            division: team.division,
                            clasificacion: await this.scrapeClasificacion(team.clasificacionUrl)
                        };
                    } catch (error) {
                        clasificaciones[team._id] = {
                            teamName: team.name,
                            error: error.message
                        };
                    }
                }
            }

            return clasificaciones;
        } catch (error) {
            throw new Error(`Error getting all classifications: ${error.message}`);
        }
    },

    async scrapeClasificacion(url) {
        try {
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                timeout: 10000
            });

            const $ = cheerio.load(response.data);
            const clasificacion = [];
            let equipoCounter = 1;

            $('table tr').each((index, element) => {
                const $row = $(element);
                const cells = $row.find('td');
                
                if (cells.length >= 4) {
                    const secondCellText = $(cells[1]).text().trim();
                    
                    if (secondCellText && secondCellText.length > 5 && 
                        !secondCellText.toLowerCase().includes('equipo') &&
                        !secondCellText.toLowerCase().includes('pos')) {
                        
                        let nombreEquipo = secondCellText
                            .replace(/^\d+\s*/, '')
                            .replace(/\s+/g, ' ')
                            .trim();
                        
                        nombreEquipo = nombreEquipo.replace(/[^\w\s.-]/g, '').trim();
                        
                        if (nombreEquipo.length > 3) {
                            const equipo = {
                                posicion: equipoCounter,
                                nombre: nombreEquipo,
                                puntos: this.extractNumber($(cells[2]).text()) || '0',
                                partidosJugados: this.extractNumber($(cells[3]).text()) || '0',
                                ganados: cells[4] ? this.extractNumber($(cells[4]).text()) || '0' : '0',
                                empatados: cells[5] ? this.extractNumber($(cells[5]).text()) || '0' : '0',
                                perdidos: cells[6] ? this.extractNumber($(cells[6]).text()) || '0' : '0'
                            };
                            
                            clasificacion.push(equipo);
                            equipoCounter++;
                        }
                    }
                }
            });

            return clasificacion.slice(0, 15);
        } catch (error) {
            throw new Error(`Error scraping classification: ${error.message}`);
        }
    },

    extractNumber(text) {
        if (!text) return '0';
        const cleaned = text.replace(/\s+/g, ' ').trim();
        const match = cleaned.match(/\d+/);
        return match ? match[0] : '0';
    }
};

module.exports = scrapingService;