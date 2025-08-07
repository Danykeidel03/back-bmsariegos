module.exports = (request, response) => {
  response.status(404).json({ succes: "NOK", message: "Ruta erronea" });
};
