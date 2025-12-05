const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  try {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
  } catch (error) {
    console.error("Database Connection/Query Error in getClassifications:", error.message)
    return { rows: [] }
  }
}
/* ***************************
 * Insert a new classification
 * ************************** */
async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    // Return the error message on failure
    return { error: error.message }; 
  }
}

/* ***************************
 * Insert a new inventory item
 * ************************** */
async function addInventory(
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
) {
    try {
        const sql = `
            INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *
        `
        const values = [
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
        ]
        return await pool.query(sql, values)
    } catch (error) {
        // Return the error message on failure
        return { error: error.message }; 
    }
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* *********************
* Get single inventory item by inv_id
* *********************/
async function getInventoryByInventoryid(inv_id){
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory
      WHERE inv_id = $1`,
      [inv_id]
    )
    // FIX: Return the single vehicle object (the first element of the rows array)
    return data.rows[0] 
  } catch (error) {
    console.error("getinventorybyid error: " + error)
    // The error is now logged and the error handler should catch the subsequent error
  }
}


module.exports = {getClassifications, getInventoryByClassificationId, getInventoryByInventoryid, addClassification, addInventory};
