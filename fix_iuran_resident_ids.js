#!/usr/bin/env node

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('🔧 Fixing iuran_payments residentId field...');

// First, let's see all the problematic records
db.all("SELECT id, residentId, month, year, amount, paid FROM iuran_payments WHERE residentId NOT LIKE 'r%' AND residentId NOT LIKE 'head_%' AND residentId NOT LIKE 'member_%'", (err, rows) => {
  if (err) {
    console.error('❌ Error fetching problematic records:', err);
    return;
  }
  
  console.log(`📊 Found ${rows.length} problematic records:`);
  rows.forEach(row => {
    console.log(`  - ${row.id}: residentId="${row.residentId}" (should be a proper ID)`);
  });
  
  if (rows.length === 0) {
    console.log('✅ No problematic records found!');
    db.close();
    return;
  }
  
  // Get all residents to create a mapping
  db.all("SELECT id, name FROM residents", (err, residents) => {
    if (err) {
      console.error('❌ Error fetching residents:', err);
      return;
    }
      
    console.log(`📊 Found ${residents.length} residents in database`);
    
    // Create a mapping of names to IDs
    const nameToIdMap = {};
    residents.forEach(resident => {
      nameToIdMap[resident.name] = resident.id;
    });
    
    console.log('📋 Name to ID mapping:');
    Object.entries(nameToIdMap).forEach(([name, id]) => {
      console.log(`  - "${name}" → ${id}`);
    });
    
    // Fix each problematic record
    let fixedCount = 0;
    let errorCount = 0;
    
    rows.forEach(row => {
      const correctId = nameToIdMap[row.residentId];
      
      if (correctId) {
        db.run(
          'UPDATE iuran_payments SET residentId = ? WHERE id = ?',
          [correctId, row.id],
          function(err) {
            if (err) {
              console.error(`❌ Error updating record ${row.id}:`, err);
              errorCount++;
            } else {
              console.log(`✅ Fixed: ${row.id} - "${row.residentId}" → ${correctId}`);
              fixedCount++;
            }
            
            // Check if this is the last update
            if (fixedCount + errorCount === rows.length) {
              console.log(`\n📊 Summary:`);
              console.log(`  - Fixed: ${fixedCount} records`);
              console.log(`  - Errors: ${errorCount} records`);
              
              // Verify the fix
              db.all("SELECT COUNT(*) as count FROM iuran_payments WHERE residentId NOT LIKE 'r%' AND residentId NOT LIKE 'head_%' AND residentId NOT LIKE 'member_%'", (err, result) => {
                if (err) {
                  console.error('❌ Error verifying fix:', err);
                } else {
                  console.log(`✅ Verification: ${result[0].count} problematic records remaining`);
                }
                db.close();
              });
            }
          }
        );
      } else {
        console.log(`❌ No matching resident found for name: "${row.residentId}"`);
        errorCount++;
        
        // Check if this is the last record
        if (fixedCount + errorCount === rows.length) {
          console.log(`\n📊 Summary:`);
          console.log(`  - Fixed: ${fixedCount} records`);
          console.log(`  - Errors: ${errorCount} records`);
          db.close();
        }
      }
    });
  });
});
