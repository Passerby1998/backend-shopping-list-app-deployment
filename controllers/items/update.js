import database from "../../database/connection.js";

const getItemsQuery = `
SELECT * FROM items WHERE id = $1 AND trip_id = $2;
`;

const updateQuery = `
UPDATE items
SET name = $1, description = $2, quantity = $3, price_each = $4
WHERE id = $5 AND trip_id = $6
`;

async function updateItem(req, res) {
  try {
    //   update field from body
    const name = req.body.name;
    const description = req.body.description;
    const quantity = req.body.quantity;
    const price_each = req.body.price_each;
    const id = req.params.id;
    const tripId = req.groceryTrip.id;

    // get default item from db
    const getItemsDb = await database.query(getItemsQuery, [id, tripId]);
    const defaultItems = getItemsDb.rows[0];

    if (!defaultItems) {
      return res.status(404).json({ error: "Item not found" });
    }

    // update todo
    const values = [
      name || defaultItems.name,
      description || defaultItems.description,
      quantity,
      price_each,
      id,
      tripId,
    ];
    const dbRes = await database.query(updateQuery, values);

    if (dbRes.rowCount === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    const data = {
      message: `Item updated id ${id} successfully`,
    };
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export default updateItem;
