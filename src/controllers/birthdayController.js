const { getDates, createBirthday } = require("../services/birthdayManage");

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
        }
}

module.exports = birthdayController;
