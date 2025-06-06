const pool = require('./config');

// 사용자 삭제
async function deleteUser(userId) {
    try {
        const [result] = await pool.execute(
            'DELETE FROM users WHERE id = ?',
            [userId]
        );
        console.log('사용자가 삭제되었습니다:', result.affectedRows);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('사용자 삭제 중 오류 발생:', error);
        throw error;
    }
}

// 스트리밍 세션 삭제
async function deleteStreamingSession(sessionId) {
    try {
        const [result] = await pool.execute(
            'DELETE FROM streaming_sessions WHERE id = ?',
            [sessionId]
        );
        console.log('스트리밍 세션이 삭제되었습니다:', result.affectedRows);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('스트리밍 세션 삭제 중 오류 발생:', error);
        throw error;
    }
}

// 조건부 다중 삭제
async function deleteInactiveUsers(daysInactive) {
    try {
        const [result] = await pool.execute(
            'DELETE FROM users WHERE last_login < DATE_SUB(NOW(), INTERVAL ? DAY)',
            [daysInactive]
        );
        console.log(`${result.affectedRows}명의 비활성 사용자가 삭제되었습니다.`);
        return result.affectedRows;
    } catch (error) {
        console.error('비활성 사용자 삭제 중 오류 발생:', error);
        throw error;
    }
}

// 관련 데이터 함께 삭제 (트랜잭션 사용)
async function deleteUserAndSessions(userId) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 먼저 사용자의 스트리밍 세션 삭제
        await connection.execute(
            'DELETE FROM streaming_sessions WHERE user_id = ?',
            [userId]
        );

        // 사용자 삭제
        const [result] = await connection.execute(
            'DELETE FROM users WHERE id = ?',
            [userId]
        );

        await connection.commit();
        console.log('사용자와 관련 세션이 삭제되었습니다:', result.affectedRows);
        return result.affectedRows > 0;
    } catch (error) {
        await connection.rollback();
        console.error('사용자 및 세션 삭제 중 오류 발생:', error);
        throw error;
    } finally {
        connection.release();
    }
}

// 사용 예시
async function example() {
    try {
        // 단일 사용자 삭제
        const userDeleted = await deleteUser(1);
        console.log('사용자 삭제 성공:', userDeleted);
        
        // 스트리밍 세션 삭제
        const sessionDeleted = await deleteStreamingSession(1);
        console.log('세션 삭제 성공:', sessionDeleted);
        
        // 30일 이상 비활성 사용자 삭제
        const inactiveDeleted = await deleteInactiveUsers(30);
        console.log('삭제된 비활성 사용자 수:', inactiveDeleted);
        
        // 사용자와 관련 세션 함께 삭제
        const allDeleted = await deleteUserAndSessions(2);
        console.log('사용자 및 세션 삭제 성공:', allDeleted);
        
    } catch (error) {
        console.error('예제 실행 중 오류 발생:', error);
    }
}

module.exports = {
    deleteUser,
    deleteStreamingSession,
    deleteInactiveUsers,
    deleteUserAndSessions
}; 