const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model") 
const validate = {}

/* **********************************
 * Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
    return [
        // classification_name is required and must not contain spaces or special chars
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a classification name.")
            .matches(/^[a-zA-Z0-9]+$/)
            .withMessage("Classification name must not contain spaces or special characters."),
    ]
}

/* ******************************
 * Check data for new classification and return errors or continue
 * ***************************** */
validate.checkNewClassification = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add New Classification",
            nav,
            classification_name,
        })
        return
    }
    next()
}

/* **********************************
 * Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
    return [
        // classification_id is required
        body("classification_id")
            .trim()
            .isInt({ min: 1 })
            .withMessage("Please select a classification."),

        // inv_make is required and must be a string
        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 3 })
            .withMessage("Please provide a vehicle make (min 3 characters)."),

        // inv_model is required and must be a string
        body("inv_model")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 3 })
            .withMessage("Please provide a vehicle model (min 3 characters)."),
            
        // inv_year is required and must be a 4-digit number
        body("inv_year")
            .trim()
            .isInt({ min: 1000, max: 9999 })
            .withMessage("Please provide a valid 4-digit year."),

        // inv_description is required
        body("inv_description")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide a description."),

        // inv_image is required and must be a valid path
        body("inv_image")
            .trim()
            .notEmpty()
            .isLength({ min: 6 })
            .withMessage("Please provide a valid image path."),

        // inv_thumbnail is required and must be a valid path
        body("inv_thumbnail")
            .trim()
            .notEmpty()
            .isLength({ min: 6 })
            .withMessage("Please provide a valid thumbnail path."),

        // inv_price is required and must be a decimal/float
        body("inv_price")
            .trim()
            .notEmpty()
            .isFloat({ min: 0.01 })
            .withMessage("Please provide a valid price."),

        // inv_miles is required and must be an integer
        body("inv_miles")
            .trim()
            .notEmpty()
            .isInt({ min: 0 })
            .withMessage("Please provide a valid mileage."),

        // inv_color is required
        body("inv_color")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide a color."),
    ]
}

/* ******************************
 * Check data for new inventory and return errors or continue
 * ***************************** */
validate.checkNewInventory = async (req, res, next) => {
    const { 
        inv_make, inv_model, inv_year, inv_description, inv_image, 
        inv_thumbnail, inv_price, inv_miles, inv_color, classification_id 
    } = req.body
    
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classificationList = await utilities.buildClassificationList(classification_id) // Pass classification_id for stickiness

        res.render("inventory/add-inventory", {
            errors: errors.array(),
            title: "Add New Inventory",
            nav,
            classificationList,
            inv_make, inv_model, inv_year, inv_description, inv_image, 
            inv_thumbnail, inv_price, inv_miles, inv_color, classification_id 
        })
        return
    }
    next()
}

module.exports = validate