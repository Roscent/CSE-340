const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the classification select list HTML
* ************************************ */
/* **************************************
* Build the classification select list HTML (For Add Inventory Form)
* ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
        '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
        classificationList += '<option value="' + row.classification_id + '"'
        // Check for stickiness: if classification_id is passed and matches row id, select it
        if (
            classification_id != null &&
            row.classification_id == classification_id
        ) {
            classificationList += " selected "
        }
        classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
}
/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* **************************************
* Build the inventory detail view HTML
* ************************************ */
Util.buildInventoryDetail = function(vehicle){ 
    const price = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(vehicle.inv_price)
    const mileage = new Intl.NumberFormat('en-US').format(vehicle.inv_miles)

    let detail = '<div id="inv-detail-wrapper" class="flex-container">' 
    
    // Image Section
    detail += '<div class="inv-image-col">'
    detail += `<img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}" />`
    detail += '</div>'

    // Details Section
    detail += '<div class="inv-details-col">'
    // FIX: Using h2 for consistency
    detail += '<h2 class="detail-heading">' + vehicle.inv_make + ' ' + vehicle.inv_model + ' Details' + '</h2>' 
    detail += '<ul class="inv-details-list">'
    
    // Price must be prominent
    detail += `<li class="price-li">**Price:** ${price}</li>` 
    // Other descriptive data
    detail += `<li>**Description:** ${vehicle.inv_description}</li>`
    detail += `<li>**Color:** ${vehicle.inv_color}</li>`
    detail += `<li>**Year:** ${vehicle.inv_year}</li>`
    detail += `<li>**Mileage:** ${mileage} miles</li>`
    
    detail += '</ul>'
    detail += '</div>'
    detail += '</div>'

    return detail
}

/* *************************
* Middleware FOr Handling Error
* Wrap other function in this for
* General error handling
****************************/
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util