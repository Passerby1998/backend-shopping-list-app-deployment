import database from "../../database/connection.js";

const query = `
SELECT * FROM groceryTrips WHERE id = $1 AND user_id = $2;
`;

async function viewGrTrip(req, res) {
  try {
    const tripId = req.params.id;
    const user_id = req.user.id;
    const dbRes = await database.query(query, [tripId, user_id]);
    const grTrip = dbRes.rows[0];

    if (!grTrip) {
      return res.status(404).json({ error: "Grocery Trip not found" });
    }
    const data = {
      message: `Grocery Trip viewed id ${tripId} successfully`,
      data: grTrip,
    };
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export default viewGrTrip;
