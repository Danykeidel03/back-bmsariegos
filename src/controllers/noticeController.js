const { newNotice, getLatestNotices } = require("../services/noticeManage");
const newNoticeValidator = require("../validations/noticeValidator");

const noticeController = {
    newNoticeController: [
        ...newNoticeValidator,
        async (request, response) => {
            try {
                const { title, descripcion } = request.body;
                const photoBuffer = request.file ? request.file.buffer : null;
                
                const data = await newNotice(
                    title,
                    photoBuffer,
                    descripcion
                );
                console.log('Respuesta del servicio:', data);
                if (data.code === 11000) {
                    const err = new Error("Duplicate key error");
                    err.code = 11000;
                    throw err;
                } else if (data.code === 11001) {
                    const err = new Error("Error Photo");
                    err.code = 11001;
                    throw err;
                } else {
                    return response.status(201).json(data);
                }
            } catch (e) {
                if (e.code === 11000) {
                    return response
                        .status(400)
                        .json({ message: "Registro duplicado", code: 11000 });
                }
                if (e.code === 11001) {
                    return response
                        .status(400)
                        .json({ message: "Foto no Valida", code: 11001 });
                }
                console.log('Error:', e);
                return response.status(500).json({ message: "Error interno del servidor" });
            }
        },
    ],
    getNoticesController: async (request, response) => {
        try {
            const data = await getLatestNotices();
            return response.status(200).json({
                status: 200,
                message: 'success',
                data: data
            });
        } catch (e) {
            console.log('Error:', e);
            return response.status(500).json({ message: "Error interno del servidor" });
        }
    }
}

module.exports = noticeController;
