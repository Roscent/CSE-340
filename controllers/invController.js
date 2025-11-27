const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
async function buildByClassificationId(req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
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
  const data = await invModel.getInventoryByInventoryid(inv_id)

  // check if vehicle data was found
  if (!data || data.length === 0){
    // Trigger a 404 error if vehicle is not found
    const err = new Error("Vehicle not found")
    err.status = 404
    return next(err)
  }
  const detailHtml = await utilities.buildInventoryDetail(data[0])
  let nev = await utilities.getNav()
  const vehicleName = `${data[0].inv_make} ${data[0].inv_model}`
  res.render("./inventory/detail", {
    title:vehicleName,
    nav,
    detailHtml,
  })
}

module.exports = {
  buildByClassificationId, buildByInventoryId,
}