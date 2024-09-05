import database from "../database/connection.js";

const createNewGroceryTripsSQL = `
    CREATE TABLE IF NOT EXISTS groceryTrips(
        id serial PRIMARY KEY,
        created_at timestamp DEFAULT NOW(),
        updated_at timestamp DEFAULT NOW(),
        user_id integer REFERENCES users(id),
        budget integer
    );
`;

const dropTimestampTriggerIfExists = `
    DROP TRIGGER IF EXISTS set_timestamp ON groceryTrips;
`;

const createUpdateTimestampFunction = `
    CREATE OR REPLACE FUNCTION update_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
`;

const createTimestampTrigger = `
    CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON groceryTrips
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();
`;

async function createGroceryTripsTable() {
  try {
    await database.query(createNewGroceryTripsSQL);
    await database.query(dropTimestampTriggerIfExists); // Drop the existing trigger if it exists
    await database.query(createUpdateTimestampFunction);
    await database.query(createTimestampTrigger);
    console.log("Grocery trips table and trigger created");
  } catch (error) {
    console.log("Error creating grocery trips table or trigger", error);
    throw error;
  }
}

export default createGroceryTripsTable;
