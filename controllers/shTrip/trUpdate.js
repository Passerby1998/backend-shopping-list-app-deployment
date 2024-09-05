import database from "../../database/connection.js";

const getGrTrip = `
SELECT * FROM groceryTrips WHERE id = $1 AND user_id = $2;
`;

const updateQuery = `
UPDATE groceryTrips
SET budget = $1
WHERE id = $2 AND user_id = $3
`;

async function updateGrTrip(req, res) {
  try {
    const budget = req.body.budget;
    const tripId = req.params.id;
    const userId = req.user.id;

    // Get the existing grocery trip from the database
    const getGrTripDb = await database.query(getGrTrip, [tripId, userId]);
    const defaultGrTrip = getGrTripDb.rows[0];

    if (!defaultGrTrip) {
      return res.status(404).json({ error: "Grocery Trip not found" });
    }

    // Update the grocery trip with the new budget, or use the existing one if not provided
    const values = [budget || defaultGrTrip.budget, tripId, userId];
    const dbRes = await database.query(updateQuery, values);

    if (dbRes.rowCount === 0) {
      return res.status(404).json({ error: "Grocery Trip not found" });
    }

    const data = {
      message: `Grocery Trip with ID ${tripId} updated successfully`,
    };
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export default updateGrTrip;
