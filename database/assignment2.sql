-- (1) Insert into account
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- (2) Update the account_type to 'Admin' for the record where the email is 'tony@starkent.com'
UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

-- (3) Delete the record where the account email is 'tony@starkent.com'
DELETE FROM account
WHERE account_email = 'tony@starkent.com';

-- (4) Update the description for the GM Hummer record by replacing 'small interiors' with 'a huge interior'
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- (5) Selects the make and model from the inventory table and the classification name
-- from the classification table using an INNER JOIN, filtered for 'Sport' classification.
SELECT
    i.inv_make,
    i.inv_model,
    c.classification_name
FROM
    inventory AS i
INNER JOIN
    classification AS c ON i.classification_id = c.classification_id
WHERE
    c.classification_name = 'Sport';


-- (6) Update all records in the inventory table to insert '/vehicles' into the file path
UPDATE inventory
SET
    inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');