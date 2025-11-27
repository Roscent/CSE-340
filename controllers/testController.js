// controllers/testController.js

/* ***************************
 * Generates an intentional 500 error
 * ************************** */
async function generateError(req, res, next) {
    // This will intentionally throw a 500-type server error
    throw new Error("Intentional 500 Server Error for Testing");
}

module.exports = {
    generateError,
}