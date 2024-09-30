const mysql = require('mysql2/promise');
const config = require('@config');

async function exportUserData(userId) {
    let connection;

    try {
        connection = await mysql.createConnection({
            host: config.dbConfig.host,
            user: config.dbConfig.user,
            password: config.dbConfig.password,
            database: config.dbConfig.database,
        });

        console.log('Exporting user data...');

        // Fetch all user-related data
        const [userData] = await connection.execute(`SELECT * FROM users WHERE id = ?`, [userId]);
        const [userAnalytics] = await connection.execute(`SELECT * FROM user_analytics WHERE user_id = ?`, [userId]);
        const [securityLogs] = await connection.execute(`SELECT * FROM security_logs WHERE user_id = ?`, [userId]);
        
        // Log the export request
        await connection.execute(`
            INSERT INTO data_access_logs (user_id, access_type) VALUES (?, 'data_export')
        `, [userId]);

        console.log('User data exported:', { userData, userAnalytics, securityLogs });
        
        // Return the data to the user (this can be returned via an API)
        return { userData, userAnalytics, securityLogs };
    } catch (error) {
        console.error('Error during user data export:', error.message);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

exportUserData(1).catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
});
