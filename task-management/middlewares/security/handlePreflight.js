/**
 * Maneja los errores capturados en la aplicación Express.
 *
 * @param {Error} err Error arrojado por la aplicación.
 * @param {Request} req Objeto de solicitud HTTP.
 */
const handlePreflight = {
  OPTIONS: (req, res) => {
    res.sendStatus(204)
  }
}

export default handlePreflight
