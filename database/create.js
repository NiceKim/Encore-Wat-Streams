const pool = require('./config');

// Add a single user
async function createUser(username, email) {
    try {
        const [result] = await pool.execute(
            'INSERT INTO users (username, email) VALUES (?, ?)',
            [username, email]
        );
        console.log('User added:', result.insertId);
        return result.insertId;
    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
    }
}

// Create streaming session
async function createStreamingSession(userId, streamName) {
    try {
        const [result] = await pool.execute(
            'INSERT INTO streaming_sessions (user_id, stream_name, started_at) VALUES (?, ?, NOW())',
            [userId, streamName]
        );
        console.log('Streaming session created:', result.insertId);
        return result.insertId;
    } catch (error) {
        console.error('Error creating streaming session:', error);
        throw error;
    }
}

// Add multiple users at once
async function createMultipleUsers(users) {
    try {
        const [result] = await pool.query(
            'INSERT INTO users (username, email) VALUES ?',
            [users.map(user => [user.username, user.email])]
        );
        console.log(`${result.affectedRows} users added.`);
        return result.affectedRows;
    } catch (error) {
        console.error('Error adding multiple users:', error);
        throw error;
    }
}

// Usage example
async function example() {
    try {
        // Add single user
        const userId = await createUser('John Doe', 'john@example.com');
        
        // Create streaming session
        const sessionId = await createStreamingSession(userId, 'First Stream');
        
        // Add multiple users at once
        const users = [
            { username: 'Jane Smith', email: 'jane@example.com' },
            { username: 'Bob Wilson', email: 'bob@example.com' }
        ];
        await createMultipleUsers(users);
        
    } catch (error) {
        console.error('Error in example:', error);
    }
}

module.exports = {
    createUser,
    createStreamingSession,
    createMultipleUsers
}; 