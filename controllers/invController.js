const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
async function buildByClassificationId(req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)

  if (!data || data.length === 0) { 
    throw new Error("No vehicles found for this classification.")
  }

  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ************************
* Build the inventory detail view
* *************************/
async function buildByInventoryId(req, res, next) {
    const inv_id = req.params.invId
    const vehicleData = await invModel.getInventoryByInventoryid(inv_id)

    // Handle case where no item is found (triggers 404)
    if (!vehicleData) {
        throw new Error("Sorry, no vehicle data could be found.")
    }

    const detailHtml = utilities.buildInventoryDetail(vehicleData)
    let nav = await utilities.getNav()

    const title = vehicleData.inv_make + ' ' + vehicleData.inv_model // Make and model for the title

    res.render("./inventory/detail", {
        title: title, 
        nav,
        detailHtml, // Pass the generated HTML to the view
        errors: null,
    })
}

/* ****************************************
* Deliver inventory management view
* *************************************** */
async function buildManagement(req, res, next) {
    let nav = await utilities.getNav()
    res.render("inventory/management", {
        title: "Vehicle Management",
        nav,
        errors: null,
    })
}

/* ****************************************
* Deliver add classification view
* *************************************** */
async function buildAddClassification(req, res, next) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: null,
    })
}

/* ****************************************
* Deliver add inventory view
* *************************************** */
async function buildAddInventory(req, res, next) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList() // Build the list
    res.render("inventory/add-inventory", {
        title: "Add New Inventory",
        nav,
        classificationList,
        errors: null,
    })
}

/* ****************************************
* Process New Classification
* *************************************** */
async function addClassification(req, res) {
    const { classification_name } = req.body
    const classResult = await invModel.addClassification(classification_name)
    if (classResult && !classResult.error) {
        req.flash(
            "notice",
            `The new classification "${classification_name}" was successfully added.`
        )
        let nav = await utilities.getNav() 
        res.status(201).render("inventory/management", {
            title: "Vehicle Management",
            nav,
            errors: null,
        })
    } else {
        req.flash("notice", "Sorry, adding the classification failed.")
        let nav = await utilities.getNav()
        res.status(501).render("inventory/add-classification", {
            title: "Add New Classification",
            nav,
            errors: null,
            classification_name,
        })
    }
}

/* ****************************************
* Process New Inventory
* *************************************** */
async function addInventory(req, res) {
    const { 
        inv_make, inv_model, inv_year, inv_description, inv_image, 
        inv_thumbnail, inv_price, inv_miles, inv_color, classification_id 
    } = req.body

    const invResult = await invModel.addInventory(
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
    )

    if (invResult && !invResult.error) {
        req.flash(
            "notice",
            `The new vehicle, a ${inv_make} ${inv_model}, was successfully added to inventory.`
        )
        let nav = await utilities.getNav() 
        res.status(201).render("inventory/management", {
            title: "Vehicle Management",
            nav,
            errors: null,
        })
    } else {
        req.flash("notice", "Sorry, adding the inventory item failed.")
        let nav = await utilities.getNav()
        let classificationList = await utilities.buildClassificationList(classification_id)
        
        res.status(501).render("inventory/add-inventory", {
            title: "Add New Inventory",
            nav,
            classificationList,
            errors: errors.array(),
            inv_make, inv_model, inv_year, inv_description, inv_image, 
            inv_thumbnail, inv_price, inv_miles, inv_color, classification_id 
        })
    }
}

module.exports = { buildByClassificationId, buildByInventoryId, buildManagement, buildAddClassification, addClassification, buildAddInventory, addInventory}