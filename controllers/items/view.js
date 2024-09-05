import database from "../../database/connection.js";

const query = `
SELECT * FROM items WHERE id = $1 AND trip_id = $2;
`;

async function viewItem(req, res) {
  try {
    const id = req.params.id;
    const tripId = req.groceryTrip.id;
    const dbRes = await database.query(query, [id, tripId]);
    const item = dbRes.rows[0];

    if (!item) {
      return res.status(404).json({ error: "item not found" });
    }
    const data = {
      message: `item viewed id ${id} successfully`,
      data: item,
    };
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export default viewItem;
