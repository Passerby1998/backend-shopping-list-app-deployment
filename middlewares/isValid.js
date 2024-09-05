import database from "../database/connection.js";

async function isValid(req, res, next) {
  try {
    const groceryTripQuery = `
      SELECT id FROM groceryTrips WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1
    `;
    const groceryTripRes = await database.query(groceryTripQuery, [
      req.user.id,
    ]);

    if (groceryTripRes.rows.length === 0) {
      // No grocery trip found, so create one
      const createTripQuery = `
        INSERT INTO groceryTrips (budget, user_id)
        VALUES ($1, $2)
        RETURNING id;
      `;
      const budget = 0; // Default budget or pass it through req.body
      const newTripRes = await database.query(createTripQuery, [
        budget,
        req.user.id,
      ]);
      req.groceryTrip = {
        id: newTripRes.rows[0].id,
      };
    } else {
      req.groceryTrip = {
        id: groceryTripRes.rows[0].id,
      };
    }

    next();
  } catch (error) {
    console.error("Database query failed:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export default isValid;
