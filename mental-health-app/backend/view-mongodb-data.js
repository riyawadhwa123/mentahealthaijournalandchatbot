const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// View MongoDB Data
async function viewMongoDBData() {
  console.log('🔍 Viewing MongoDB Data...\n');
  
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📚 Found ${collections.length} collections:\n`);

    // View data from each collection
    for (const collection of collections) {
      const collectionName = collection.name;
      console.log(`📋 Collection: ${collectionName}`);
      console.log('─'.repeat(50));
      
      try {
        const data = await mongoose.connection.db.collection(collectionName).find({}).toArray();
        console.log(`📄 Total documents: ${data.length}`);
        
        if (data.length > 0) {
          console.log('📖 Sample documents:');
          data.slice(0, 3).forEach((doc, index) => {
            console.log(`\n   Document ${index + 1}:`);
            console.log(`   ${JSON.stringify(doc, null, 4).replace(/\n/g, '\n   ')}`);
          });
          
          if (data.length > 3) {
            console.log(`\n   ... and ${data.length - 3} more documents`);
          }
        } else {
          console.log('   (No documents found)');
        }
      } catch (error) {
        console.log(`   ❌ Error reading collection: ${error.message}`);
      }
      
      console.log('\n');
    }

    // Show database statistics
    console.log('📊 Database Statistics:');
    console.log('─'.repeat(50));
    const stats = await mongoose.connection.db.stats();
    console.log(`Database: ${stats.db}`);
    console.log(`Collections: ${stats.collections}`);
    console.log(`Documents: ${stats.objects}`);
    console.log(`Data Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Storage Size: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`);

  } catch (error) {
    console.error('❌ Error viewing MongoDB data:');
    console.error(`Error: ${error.message}`);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('\n🔌 MongoDB connection closed');
    }
  }
}

// Run the function
viewMongoDBData(); 