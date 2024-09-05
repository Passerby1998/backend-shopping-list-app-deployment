import database from "../../database/connection.js";

const query = `
INSERT INTO items (name, description, trip_id, quantity, price_each)
VALUES ($1, $2, $3, $4, $5)
RETURNING id, name, description, trip_id, created_at, updated_at, quantity, price_each;
`;

async function createItem(req, res) {
  try {
    const { name, description, quantity, price_each } = req.body;

    if (!name || !quantity || !price_each) {
      return res.status(400).json({
        error: "Name, quantity, and price_each are required",
      });
    }

    // Ensure quantity and price_each are numbers
    const parsedQuantity = parseInt(quantity, 10);
    const parsedPriceEach = parseFloat(price_each);

    if (isNaN(parsedQuantity) || isNaN(parsedPriceEach)) {
      return res.status(400).json({
        error: "Quantity and price_each must be valid numbers",
      });
    }

    // req.groceryTrip.id should be set by some middleware that verifies the trip exists
    const trip_id = req.groceryTrip.id;

    const values = [
      name,
      description,
      trip_id,
      parsedQuantity,
      parsedPriceEach,
    ];

    const dbRes = await database.query(query, values);
    const item = dbRes.rows[0];

    const data = {
      message: "Item created successfully",
      data: item,
    };

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export default createItem;
