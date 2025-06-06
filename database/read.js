const pool = require('./config');

// Get all users
async function getAllUsers() {
    try {
        const [rows] = await pool.query('SELECT * FROM users');
        return rows;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}

// Get specific user
async function getUserById(userId) {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE id = ?',
            [userId]
        );
        return rows[0];
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}

// Get user's streaming sessions
async function getUserStreams(userId) {
    try {
        const [rows] = await pool.execute(
            `SELECT s.*, u.username 
             FROM streaming_sessions s 
             JOIN users u ON s.user_id = u.id 
             WHERE u.id = ?`,
            [userId]
        );
        return rows;
    } catch (error) {
        console.error('Error fetching streaming sessions:', error);
        throw error;
    }
}

// Search users by condition
async function searchUsers(searchTerm) {
    try {
        const [rows] = await pool.execute(
            `SELECT * FROM users 
             WHERE username LIKE ? OR email LIKE ?`,
            [`%${searchTerm}%`, `%${searchTerm}%`]
        );
        return rows;
    } catch (error) {
        console.error('Error searching users:', error);
        throw error;
    }
}

// Usage example
async function example() {
    try {
        // Get all users
        const allUsers = await getAllUsers();
        console.log('All users:', allUsers);
        
        // Get specific user
        const user = await getUserById(1);
        console.log('User info:', user);
        
        // Get user's streaming sessions
        const streams = await getUserStreams(1);
        console.log('Streaming sessions:', streams);
        
        // Search users
        const searchResults = await searchUsers('John');
        console.log('Search results:', searchResults);
        
    } catch (error) {
        console.error('Error in example:', error);
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    getUserStreams,
    searchUsers
}; 