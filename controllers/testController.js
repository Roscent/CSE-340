/* ***************************
 * Generates an intentional 500 error
 * ************************** */
async function generateError(req, res, next) {
    throw new Error("Intentional 500 Server Error for Testing");
}

module.exports = {generateError}