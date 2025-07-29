// Script to clear existing tokens and force re-login
// Run this script to clear any existing problematic tokens

// ES module version

console.log('🔧 Token Clear Script');
console.log('=====================');
console.log('');
console.log('This script will help you clear existing tokens that may be causing issues.');
console.log('');
console.log('To clear your tokens:');
console.log('1. Open your browser developer tools (F12)');
console.log('2. Go to Application/Storage tab');
console.log('3. Find "Cookies" under your localhost domain');
console.log('4. Delete the "token" cookie');
console.log('5. Refresh the page and login again');
console.log('');
console.log('Alternatively, you can:');
console.log('1. Open browser console (F12)');
console.log('2. Run: document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"');
console.log('3. Refresh the page and login again');
console.log('');
console.log('This will ensure you get a new JWT token with the correct string format.'); 