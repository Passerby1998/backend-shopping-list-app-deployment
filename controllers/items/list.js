import database from "../../database/connection.js";

const query = `
SELECT id, name, description, trip_id, created_at, updated_at, quantity, price_each FROM items
WHERE trip_id = $1;
`;

async function listItems(req, res) {
  try {
    const createdBy = req.groceryTrip.id;
    const dbRes = await database.query(query, [createdBy]);
    const items = dbRes.rows;
    const data = {
      message: "Items listed successfully",
      data: items,
    };
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export default listItems;
