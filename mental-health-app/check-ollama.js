#!/usr/bin/env node

// const fetch = require('node-fetch');
const fetch = (...args) => import('node-fetch').then(mod => mod.default(...args));

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

async function checkOllama() {
  console.log('🔍 Checking Ollama Status...\n');

  try {
    // Check if Ollama is running
    const statusResponse = await fetch(`${OLLAMA_URL}/api/tags`);
    if (!statusResponse.ok) {
      console.log('❌ Ollama is not running or not accessible');
      console.log('💡 Start Ollama with: ollama serve');
      return;
    }

    const models = await statusResponse.json();
    console.log('✅ Ollama is running!');
    console.log(`📍 URL: ${OLLAMA_URL}`);
    console.log(`📦 Available models: ${models.models?.length || 0}\n`);

    if (models.models && models.models.length > 0) {
      console.log('📋 Installed Models:');
      models.models.forEach(model => {
        console.log(`   - ${model.name} (${(model.size / 1024 / 1024 / 1024).toFixed(1)}GB)`);
      });
      console.log('');
    }

    // Check for recommended model
    const hasLlama2 = models.models?.some(m => m.name.includes('llama2:7b'));
    if (!hasLlama2) {
      console.log('⚠️  Recommended: Install llama2:7b for faster responses');
      console.log('💡 Run: ollama pull llama2:7b\n');
    } else {
      console.log('✅ Recommended model (llama2:7b) is installed!\n');
    }

    // Performance tips
    console.log('🚀 Performance Tips:');
    console.log('   1. Use llama2:7b instead of larger models');
    console.log('   2. Ensure you have at least 8GB RAM available');
    console.log('   3. Close other applications to free up memory');
    console.log('   4. Use fallback mode for instant responses');
    console.log('   5. Keep chat history short for faster processing\n');

    // Test model loading
    console.log('🧪 Testing model response...');
    try {
      const testResponse = await fetch(`${OLLAMA_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama2:7b',
          prompt: 'Hello, how are you?',
          stream: false,
          options: { num_predict: 50 }
        })
      });

      if (testResponse.ok) {
        const result = await testResponse.json();
        console.log('✅ Model is responding correctly!');
        console.log(`⏱️  Response time: ${result.eval_duration ? (result.eval_duration / 1000000).toFixed(2) + 'ms' : 'Unknown'}`);
      } else {
        console.log('❌ Model test failed');
      }
    } catch (error) {
      console.log('❌ Model test failed:', error.message);
    }

  } catch (error) {
    console.log('❌ Cannot connect to Ollama:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Make sure Ollama is installed: https://ollama.ai');
    console.log('   2. Start Ollama: ollama serve');
    console.log('   3. Check if port 11434 is available');
    console.log('   4. Try: ollama pull llama2:7b');
  }
}

checkOllama(); 