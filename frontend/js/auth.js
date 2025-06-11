// Storage key for users
const STORAGE_KEY = 'theater_users_v3';

// Clear all authentication data - useful for debugging
function clearAllAuthData() {
    // Remove all possible storage keys
    ['theater_users', 'theater_users_v1', 'theater_users_v2', 'theater_users_v3', 'isLoggedIn', 'userEmail'].forEach(key => {
        localStorage.removeItem(key);
    });
    console.log('All authentication data cleared');
}

// Debug function to help track user data
function debugAuth(action, data) {
    console.group(`🔍 Auth Debug - ${action}`);
    console.log('Action:', action);
    console.log('Data:', data);
    console.log('Storage Key:', STORAGE_KEY);
    console.log('Raw Storage:', localStorage.getItem(STORAGE_KEY));
    console.log('All localStorage keys:', Object.keys(localStorage));
    console.groupEnd();
}

// Get all registered users
function getUsers() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        debugAuth('getUsers', { stored });
        
        if (!stored) {
            // Initialize with default users
            const defaultUsers = [
                { email: 'test@example.com', password: 'password123', name: 'Test User' },
                { email: 'admin@theater.com', password: 'admin123', name: 'Admin User' }
            ];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
            debugAuth('initializeDefaultUsers', defaultUsers);
            return defaultUsers;
        }
        
        const users = JSON.parse(stored);
        debugAuth('getUsers - parsed', users);
        return users;
    } catch (error) {
        console.error('❌ Error reading users:', error);
        // If there's an error, clear storage and start fresh
        localStorage.removeItem(STORAGE_KEY);
        return getUsers(); // Recursively call to initialize with defaults
    }
}

// Save users to storage
function saveUsers(users) {
    try {
        // Ensure all emails are lowercase and trimmed
        users = users.map(user => ({
            ...user,
            email: user.email.toLowerCase().trim()
        }));
        
        const jsonData = JSON.stringify(users);
        localStorage.setItem(STORAGE_KEY, jsonData);
        debugAuth('saveUsers - saved', { users, jsonData });
        
        // Verify the save worked
        const verification = localStorage.getItem(STORAGE_KEY);
        if (verification === jsonData) {
            console.log('✅ Save verified successfully');
            return true;
        } else {
            console.error('❌ Save verification failed');
            return false;
        }
    } catch (error) {
        console.error('❌ Error saving users:', error);
        return false;
    }
}

// Check if email is registered
function isUserRegistered(email) {
    try {
        email = email.toLowerCase().trim();
        debugAuth('isUserRegistered - checking', { email });
        
        const users = getUsers();
        const exists = users.some(u => u.email === email);
        
        debugAuth('isUserRegistered - result', { email, exists, totalUsers: users.length, allEmails: users.map(u => u.email) });
        return exists;
    } catch (error) {
        console.error('❌ Error in isUserRegistered:', error);
        return false;
    }
}

// Add a new user
function addUser(email, password, name) {
    try {
        email = email.toLowerCase().trim();
        debugAuth('addUser - attempt', { email, name });
        
        // Get current users
        const users = getUsers();
        debugAuth('addUser - current users', users);
        
        // Check if user already exists
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            debugAuth('addUser - failed (exists)', { email, existingUser });
            return false;
        }
        
        // Add new user
        const newUser = { email, password, name };
        users.push(newUser);
        
        // Save updated users list
        const saved = saveUsers(users);
        debugAuth('addUser - result', { email, success: saved, newTotalUsers: users.length });
        
        return saved;
    } catch (error) {
        console.error('❌ Error in addUser:', error);
        return false;
    }
}

// Find a user by email
function findUser(email) {
    try {
        email = email.toLowerCase().trim();
        debugAuth('findUser - searching', { email });
        
        const users = getUsers();
        const user = users.find(u => u.email === email);
        
        debugAuth('findUser - result', { email, found: !!user, user: user ? { email: user.email, name: user.name } : null });
        return user;
    } catch (error) {
        console.error('❌ Error in findUser:', error);
        return null;
    }
}

// UI Helper functions
function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
        element.classList.add('error-message');
        element.classList.remove('success-message');
        console.log('🔴 Error shown:', message);
    }
}

function showSuccess(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
        element.classList.add('success-message');
        element.classList.remove('error-message');
        console.log('🟢 Success shown:', message);
    }
}

function clearMessages() {
    const messages = document.querySelectorAll('.error-message, .success-message');
    messages.forEach(element => {
        element.textContent = '';
        element.style.display = 'none';
    });
}

// Initialize storage and clear any stale data
window.addEventListener('load', () => {
    console.log('🚀 Auth system initializing...');
    
    // Clear any old storage keys to prevent conflicts
    ['theater_users', 'theater_users_v1', 'theater_users_v2'].forEach(key => {
        if (localStorage.getItem(key)) {
            console.log(`🧹 Removing old storage key: ${key}`);
            localStorage.removeItem(key);
        }
    });
    
    // Initialize storage if needed
    const currentUsers = getUsers();
    
    debugAuth('page-load-complete', {
        page: window.location.pathname,
        currentUsers: currentUsers,
        storageKey: STORAGE_KEY
    });
    
    // Add debug helper to window for manual debugging
    window.authDebug = {
        clearAllData: clearAllAuthData,
        getUsers: getUsers,
        findUser: findUser,
        isUserRegistered: isUserRegistered,
        currentStorage: () => localStorage.getItem(STORAGE_KEY)
    };
    
    console.log('🔧 Debug helper available: window.authDebug');
}); 