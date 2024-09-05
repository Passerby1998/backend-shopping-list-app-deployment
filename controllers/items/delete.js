import database from "../../database/connection.js";

const query = `
DELETE FROM items WHERE id = $1 AND trip_id = $2
`;

async function deleteItem(req, res) {
  try {
    const itemsId = req.params.id;
    const tripId = req.groceryTrip.id;
    const dbRes = await database.query(query, [itemsId, tripId]);
    if (dbRes.rowCount === 0) {
      return res.status(404).json({ error: "Item not found" });
    }
    const data = {
      message: `Item deleted id ${itemsId} successfully`,
    };
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export default deleteItem;
