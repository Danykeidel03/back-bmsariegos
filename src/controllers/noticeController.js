const { newNotice, getLatestNotices, getNotices, deleteNotice } = require("../services/noticeManage");
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
    },
    getAllNoticesController: async (request, response) => {
        try {
            const data = await getNotices();
            return response.status(200).json({
                status: 200,
                message: 'success',
                data: data
            });
        } catch (e) {
            console.log('Error:', e);
            return response.status(500).json({ message: "Error interno del servidor" });
        }
    },
    deleteNotice:
        async (request, response) => {
            try {
                const { id } = request.params;
                const data = await deleteNotice(id);
                
                if (!data) {
                    return response.status(404).json({
                        status: 404,
                        message: 'Notice not found'
                    });
                }
                
                return response.status(200).json({
                    status: 200,
                    message: 'Notice deleted successfully',
                    data: data
                });
            } catch (e) {
                console.log(e)
                return response.status(500).json({
                    status: 500,
                    message: 'error',
                    data: e.message
                })
            }
        }
}

module.exports = noticeController;