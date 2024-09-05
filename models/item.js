import database from "../database/connection.js";

const createNewItemSQL = `
    CREATE TABLE IF NOT EXISTS items(
        id serial PRIMARY KEY,
        name varchar(255),
        description varchar(255),
        trip_id integer REFERENCES groceryTrips(id),
        created_at timestamp DEFAULT NOW(),
        updated_at timestamp DEFAULT NOW(),
        quantity integer,
        price_each integer
    );
`;

const dropTimestampTriggerIfExists = `
    DROP TRIGGER IF EXISTS set_timestamp ON items;
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
    BEFORE UPDATE ON items
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();
`;

async function createItemsTable() {
  try {
    await database.query(createNewItemSQL);
    await database.query(dropTimestampTriggerIfExists); // Drop the trigger if it exists
    await database.query(createUpdateTimestampFunction);
    await database.query(createTimestampTrigger);
    console.log("Items table and trigger created");
  } catch (error) {
    console.log("Error creating items table or trigger", error);
    throw error;
  }
}

export default createItemsTable;
