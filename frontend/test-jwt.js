// JWT Testing Automation Script for Cambodian Theater Live
// Copy this code and paste it in browser console to test JWT functionality

console.log('🎭 JWT Testing Script for Cambodian Theater Live');

// Test JWT token decoding
function testJWTDecoding(token) {
    try {
        console.log('🔍 Testing JWT decoding...');
        
        const parts = token.split('.');
        if (parts.length !== 3) {
            console.error('❌ Invalid JWT format');
            return false;
        }

        const header = JSON.parse(atob(parts[0]));
        const payload = JSON.parse(atob(parts[1]));
        
        console.log('✅ JWT Header:', header);
        console.log('✅ JWT Payload:', payload);
        
        // Check expiration
        if (payload.exp) {
            const now = Math.floor(Date.now() / 1000);
            const isExpired = payload.exp < now;
            console.log(`🕒 Token ${isExpired ? 'EXPIRED' : 'VALID'} - Expires: ${new Date(payload.exp * 1000)}`);
        }
        
        return true;
    } catch (error) {
        console.error('❌ JWT decoding failed:', error.message);
        return false;
    }
}

// Test storage methods
function testStorage() {
    console.log('\n📦 Testing storage methods...');
    
    const testToken = 'test.jwt.' + Date.now();
    
    // Test localStorage
    try {
        localStorage.setItem('test_jwt', testToken);
        const retrieved = localStorage.getItem('test_jwt');
        localStorage.removeItem('test_jwt');
        console.log(retrieved === testToken ? '✅ localStorage: WORKING' : '❌ localStorage: FAILED');
    } catch (error) {
        console.error('❌ localStorage error:', error.message);
    }
    
    // Test sessionStorage  
    try {
        sessionStorage.setItem('test_jwt', testToken);
        const retrieved = sessionStorage.getItem('test_jwt');
        sessionStorage.removeItem('test_jwt');
        console.log(retrieved === testToken ? '✅ sessionStorage: WORKING' : '❌ sessionStorage: FAILED');
    } catch (error) {
        console.error('❌ sessionStorage error:', error.message);
    }
}

// Test current authentication state
function testAuthState() {
    console.log('\n🔐 Testing authentication state...');
    
    const token = localStorage.getItem('auth_token') || 
                 sessionStorage.getItem('auth_token') ||
                 localStorage.getItem('jwtToken');
    
    if (!token) {
        console.log('ℹ️ No authentication token found');
        return false;
    }
    
    console.log('✅ Token found:', token.substring(0, 50) + '...');
    return testJWTDecoding(token);
}

// Test API request with JWT
async function testAPIRequest() {
    console.log('\n🌐 Testing API request with JWT...');
    
    const token = localStorage.getItem('auth_token') || 
                 sessionStorage.getItem('auth_token');
    
    if (!token) {
        console.log('❌ No token available for API request');
        return;
    }
    
    try {
        const response = await fetch('/api/shows', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log(`📡 API Response: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ API data received:', data);
        } else {
            console.log('❌ API request failed');
        }
    } catch (error) {
        console.error('❌ API request error:', error.message);
    }
}

// Run all tests
async function runAllTests() {
    console.log('🧪 Starting JWT Tests for Cambodian Theater Live...\n');
    
    testStorage();
    testAuthState();
    await testAPIRequest();
    
    console.log('\n✅ JWT testing complete!');
}

// Make functions available globally
window.jwtTest = {
    runAll: runAllTests,
    storage: testStorage,
    auth: testAuthState,
    decode: testJWTDecoding,
    api: testAPIRequest
};

console.log('\n💡 Available commands:');
console.log('   jwtTest.runAll()     - Run all tests');
console.log('   jwtTest.storage()    - Test storage only');
console.log('   jwtTest.auth()       - Test auth state');
console.log('   jwtTest.api()        - Test API request'); 