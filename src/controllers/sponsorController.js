const { createSponsor, getSponsors } = require("../services/sponsorManage");

const sponsorController = {
    createSponsor:
        async (request, response) => {
            try {
                const { name } = request.body;
                const photoBuffer = request.file ? request.file.buffer : null;
                
                const data = await createSponsor({ name, photoBuffer });
                
                if (data.code === 11001) {
                    return response.status(400).json({ message: "Foto no válida", code: 11001 });
                }
                
                return response.status(201).json({
                    status: 201,
                    message: 'Sponsor created successfully',
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
    getSponsors:
        async (request, response) => {
            try {
                const data = await getSponsors();
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

module.exports = sponsorController;