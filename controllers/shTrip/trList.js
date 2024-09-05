import database from "../../database/connection.js";

const query = `
SELECT id, created_at, updated_at, user_id, budget FROM groceryTrips
WHERE user_id = $1;
`;

async function listGrTrip(req, res) {
  try {
    const createdBy = req.user.id;
    const dbRes = await database.query(query, [createdBy]);
    const grTrip = dbRes.rows;
    const data = {
      message: "Grocery Trip listed successfully",
      data: grTrip,
    };
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export default listGrTrip;
