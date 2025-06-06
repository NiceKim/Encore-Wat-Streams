const pool = require('./config');

// Update user information
async function updateUser(userId, updates) {
    try {
        const [result] = await pool.execute(
            'UPDATE users SET username = ?, email = ? WHERE id = ?',
            [updates.username, updates.email, userId]
        );
        console.log('User information updated:', result.affectedRows);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}

// Update streaming session status
async function updateStreamingSession(sessionId, status) {
    try {
        const [result] = await pool.execute(
            'UPDATE streaming_sessions SET status = ?, updated_at = NOW() WHERE id = ?',
            [status, sessionId]
        );
        console.log('Streaming session updated:', result.affectedRows);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error updating streaming session:', error);
        throw error;
    }
}

// Update multiple users by condition
async function updateUserStatus(status, condition) {
    try {
        const [result] = await pool.execute(
            'UPDATE users SET status = ? WHERE status = ?',
            [status, condition]
        );
        console.log(`${result.affectedRows} users status updated.`);
        return result.affectedRows;
    } catch (error) {
        console.error('Error updating user status:', error);
        throw error;
    }
}

// Usage example
async function example() {
    try {
        // Update user information
        const userUpdated = await updateUser(1, {
            username: 'John Doe Jr',
            email: 'john.jr@example.com'
        });
        console.log('User update success:', userUpdated);
        
        // Update streaming session status
        const sessionUpdated = await updateStreamingSession(1, 'ended');
        console.log('Session update success:', sessionUpdated);
        
        // Update inactive users status
        const statusUpdated = await updateUserStatus('active', 'inactive');
        console.log('Number of users status updated:', statusUpdated);
        
    } catch (error) {
        console.error('Error in example:', error);
    }
}

module.exports = {
    updateUser,
    updateStreamingSession,
    updateUserStatus
}; 