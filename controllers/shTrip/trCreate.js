import database from "../../database/connection.js";

const insertQuery = `
INSERT INTO groceryTrips (budget, user_id)
VALUES ($1, $2)
RETURNING id, created_at, updated_at, user_id, budget;
`;

const selectUserQuery = `
SELECT id FROM users WHERE id = $1;
`;

async function createGrTrip(req, res) {
  try {
    const { budget } = req.body;
    const user_id = req.user?.id; // Assuming user_id comes from a middleware that sets req.user

    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Ensure budget is a number
    const parsedBudget = parseInt(budget, 10);

    if (isNaN(parsedBudget)) {
      return res.status(400).json({ error: "Budget must be a valid number" });
    }

    // Check if the user exists
    const userResult = await database.query(selectUserQuery, [user_id]);

    if (userResult.rowCount === 0) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Insert into groceryTrips
    const values = [parsedBudget, user_id];
    const dbRes = await database.query(insertQuery, values);
    const groceryTrip = dbRes.rows[0];

    const data = {
      message: "Grocery Trip created successfully",
      groceryTrip,
      userDetails: userResult.rows[0],
    };

    return res.status(201).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export default createGrTrip;
