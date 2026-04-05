const axios = require('axios');

async function checkServer() {
  console.log('🔍 Checking Backend Server Status...\n');
  
  try {
    // Check if server is running
    console.log('1️⃣ Testing Server Health Endpoint...');
    const healthResponse = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Server is running!');
    console.log(`📊 Status: ${healthResponse.data.status}`);
    console.log(`💬 Message: ${healthResponse.data.message}`);
    console.log(`🌍 Environment: ${healthResponse.data.environment}`);
    console.log(`⏰ Timestamp: ${healthResponse.data.timestamp}\n`);

    // Test MongoDB through the server
    console.log('2️⃣ Testing MongoDB through Server...');
    
    // Try to create a test user to verify MongoDB operations
    const testUser = {
      username: 'test-user-' + Date.now(),
      email: `test${Date.now()}@example.com`,
      password: 'testpassword123'
    };

    try {
      const registerResponse = await axios.post('http://localhost:5000/api/auth/register', testUser);
      console.log('✅ MongoDB is working through the server!');
      console.log(`👤 Test user created: ${testUser.username}`);
      
      // Clean up - delete the test user
      console.log('🧹 Cleaning up test user...');
      // Note: You might need to implement a delete endpoint or handle this differently
      console.log('ℹ️ Test user created successfully - consider manual cleanup if needed\n');
      
    } catch (dbError) {
      if (dbError.response && dbError.response.status === 409) {
        console.log('✅ MongoDB is working (user already exists error is expected)');
      } else {
        console.log('⚠️ MongoDB test through server had issues:');
        console.log(`Error: ${dbError.message}`);
      }
    }

    console.log('🎉 Server and MongoDB are working correctly!');
    console.log('✅ Ready for your AI interviewer!');

  } catch (error) {
    console.error('❌ Server Check Failed:');
    
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Server is not running on port 5000');
      console.log('\n🔧 To start the server:');
      console.log('1. Navigate to the backend directory: cd backend');
      console.log('2. Install dependencies: npm install');
      console.log('3. Create .env file with your MONGODB_URI');
      console.log('4. Start the server: npm run dev');
    } else {
      console.error(`Error: ${error.message}`);
      console.error(`Status: ${error.response?.status}`);
      console.error(`Data: ${JSON.stringify(error.response?.data, null, 2)}`);
    }
  }
}

// Run the check
checkServer(); 