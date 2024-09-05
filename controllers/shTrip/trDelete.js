import database from "../../database/connection.js";

const query = `
DELETE FROM groceryTrips WHERE id = $1 AND user_id = $2
`;

async function deleteGrTrip(req, res) {
  try {
    const tripId = req.params.id;
    const user_id = req.user?.id; // Assuming user_id comes from a middleware that sets req.user

    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const dbRes = await database.query(query, [tripId, user_id]);
    if (dbRes.rowCount === 0) {
      return res.status(404).json({ error: "Grocery Trip not found" });
    }

    const data = {
      message: `Grocery Trip with ID ${tripId} deleted successfully`,
    };
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export default deleteGrTrip;
