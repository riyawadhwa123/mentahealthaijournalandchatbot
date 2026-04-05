const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Test MongoDB Connection and Functionality
async function testMongoDB() {
  console.log('🔍 MongoDB Connection Test Starting...\n');
  
  try {
    // 1. Test Connection
    console.log('1️⃣ Testing MongoDB Connection...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected Successfully!');
    console.log(`📍 Connection String: ${process.env.MONGODB_URI.replace(/\/\/.*@/, '//***:***@')}`);
    console.log(`🏠 Database: ${mongoose.connection.db.databaseName}`);
    console.log(`🔌 Host: ${mongoose.connection.host}`);
    console.log(`🚪 Port: ${mongoose.connection.port}\n`);

    // 2. Test Database Operations
    console.log('2️⃣ Testing Database Operations...');
    
    // Create a test collection
    const testCollection = mongoose.connection.db.collection('test_collection');
    
    // Insert a test document
    const testDoc = {
      message: 'Hello from MongoDB test!',
      timestamp: new Date(),
      testId: 'interview-test-' + Date.now()
    };
    
    const insertResult = await testCollection.insertOne(testDoc);
    console.log('✅ Document inserted successfully');
    console.log(`📄 Inserted ID: ${insertResult.insertedId}`);
    
    // Read the document back
    const readResult = await testCollection.findOne({ _id: insertResult.insertedId });
    console.log('✅ Document read successfully');
    console.log(`📖 Retrieved: ${JSON.stringify(readResult, null, 2)}`);
    
    // Update the document
    const updateResult = await testCollection.updateOne(
      { _id: insertResult.insertedId },
      { $set: { status: 'updated', updatedAt: new Date() } }
    );
    console.log('✅ Document updated successfully');
    console.log(`✏️ Modified count: ${updateResult.modifiedCount}`);
    
    // Delete the test document
    const deleteResult = await testCollection.deleteOne({ _id: insertResult.insertedId });
    console.log('✅ Document deleted successfully');
    console.log(`🗑️ Deleted count: ${deleteResult.deletedCount}\n`);

    // 3. Test Collections
    console.log('3️⃣ Checking Existing Collections...');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📚 Found ${collections.length} collections:`);
    collections.forEach(collection => {
      console.log(`   - ${collection.name}`);
    });
    console.log('');

    // 4. Test Database Stats
    console.log('4️⃣ Database Statistics...');
    const stats = await mongoose.connection.db.stats();
    console.log(`📊 Database: ${stats.db}`);
    console.log(`📁 Collections: ${stats.collections}`);
    console.log(`📄 Documents: ${stats.objects}`);
    console.log(`💾 Data Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`🗄️ Storage Size: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB\n`);

    // 5. Test Connection Health
    console.log('5️⃣ Connection Health Check...');
    try {
      const adminDb = mongoose.connection.db.admin();
      const serverStatus = await adminDb.serverStatus();
      console.log(`🖥️ Server Version: ${serverStatus.version}`);
      console.log(`⏱️ Uptime: ${Math.floor(serverStatus.uptime / 3600)} hours`);
      console.log(`🔗 Active Connections: ${serverStatus.connections.active}`);
      console.log(`💾 Memory Usage: ${(serverStatus.mem.resident / 1024 / 1024).toFixed(2)} MB\n`);
    } catch (adminError) {
      console.log('ℹ️ Admin operations restricted (normal for MongoDB Atlas)');
      console.log('✅ Connection is healthy and working properly\n');
    }

    console.log('🎉 MongoDB Core Functionality Tests Passed!');
    console.log('✅ Your MongoDB is working perfectly for the interview!');
    console.log('📊 Database Status: HEALTHY');
    console.log('🔗 Connection: STABLE');
    console.log('💾 Operations: ALL WORKING');

  } catch (error) {
    console.error('❌ MongoDB Test Failed:');
    console.error(`Error: ${error.message}`);
    console.error(`Code: ${error.code}`);
    console.error(`Stack: ${error.stack}`);
    
    // Provide helpful debugging information
    console.log('\n🔧 Troubleshooting Tips:');
    console.log('1. Check if MONGODB_URI is set in your .env file');
    console.log('2. Verify your MongoDB connection string format');
    console.log('3. Ensure your IP is whitelisted in MongoDB Atlas');
    console.log('4. Check if your MongoDB cluster is running');
    console.log('5. Verify username/password in connection string');
  } finally {
    // Close the connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('\n🔌 MongoDB connection closed');
    }
  }
}

// Run the test
testMongoDB(); 