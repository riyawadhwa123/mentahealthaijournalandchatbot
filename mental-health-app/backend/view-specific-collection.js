const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// View specific collection data
async function viewCollectionData(collectionName) {
  console.log(`🔍 Viewing data from collection: ${collectionName}\n`);
  
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const collection = mongoose.connection.db.collection(collectionName);
    const data = await collection.find({}).toArray();
    
    console.log(`📋 Collection: ${collectionName}`);
    console.log(`📄 Total documents: ${data.length}`);
    console.log('─'.repeat(60));
    
    if (data.length === 0) {
      console.log('   (No documents found in this collection)');
    } else {
      data.forEach((doc, index) => {
        console.log(`\n📄 Document ${index + 1}:`);
        console.log('─'.repeat(40));
        
        // Format the document nicely
        const formattedDoc = JSON.stringify(doc, null, 2);
        console.log(formattedDoc);
      });
    }

  } catch (error) {
    console.error('❌ Error viewing collection data:');
    console.error(`Error: ${error.message}`);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('\n🔌 MongoDB connection closed');
    }
  }
}

// Get collection name from command line argument
const collectionName = process.argv[2];

if (!collectionName) {
  console.log('Usage: node view-specific-collection.js <collection-name>');
  console.log('Available collections: users, journals, moods, chats, test_collection');
  console.log('Example: node view-specific-collection.js users');
} else {
  viewCollectionData(collectionName);
} 