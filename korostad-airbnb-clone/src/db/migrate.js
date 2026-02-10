const fs = require('fs');
const path = require('path');
const db = require('../config/db');

// Read the SQL schema file
const schemaPath = path.join(__dirname, 'schema.sql');
const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

// Run the migration
async function runMigration() {
  try {
    console.log('Starting database migration...');
    await db.query(schemaSQL);
    console.log('Database migration completed successfully!');
  } catch (error) {
    console.error('Error running migration:', error.message);
  }
}

if (require.main === module) {
  runMigration();
}

module.exports = runMigration;