const mysql = require('mysql2/promise');
const crypto = require('crypto');
const config = require('@config');

// Utility function to generate a pseudonymized ID (deterministic hash)
function pseudonymize(data) {
    return crypto.createHash('sha256').update(data.toString()).digest('hex');
}

// Main function to handle anonymization or nullification
async function processUserData({ mode = 'anonymize', userId = null, startDate = null, endDate = null }) {
    let connection;

    // Validate the mode
    if (!['anonymize', 'nullify'].includes(mode)) {
        throw new Error('Invalid mode. Use "anonymize" or "nullify".');
    }

    try {
        connection = await mysql.createConnection({
            host: config.dbConfig.host,
            user: config.dbConfig.user,
            password: config.dbConfig.password,
            database: config.dbConfig.database,
        });

        console.log(`Starting ${mode} process for user data...`);

        // Prepare date range condition if provided
        let dateCondition = '';
        if (startDate && endDate) {
            dateCondition = `AND action_timestamp BETWEEN ? AND ?`;
        } else if (startDate) {
            dateCondition = `AND action_timestamp >= ?`;
        } else if (endDate) {
            dateCondition = `AND action_timestamp <= ?`;
        }

        let parameters = [];
        if (startDate) parameters.push(startDate);
        if (endDate) parameters.push(endDate);

        if (userId) {
            const pseudonymizedId = pseudonymize(userId);

            // Apply actions based on mode: anonymize or nullify
            if (mode === 'anonymize') {
                console.log(`Anonymizing data for user ID: ${userId}...`);

                // Pseudonymize user data in `user_analytics`
                await connection.execute(`
                    UPDATE user_analytics
                    SET user_id = ?, user_ip = NULL
                    WHERE user_id = ? ${dateCondition}
                `, [pseudonymizedId, userId, ...parameters]);

                // Pseudonymize data in `security_logs`
                await connection.execute(`
                    UPDATE security_logs
                    SET user_id = ?, user_ip = NULL, event_details = 'ANONYMIZED'
                    WHERE user_id = ? ${dateCondition}
                `, [pseudonymizedId, userId, ...parameters]);

                console.log(`User data for user_id ${userId} pseudonymized.`);
            } else if (mode === 'nullify') {
                console.log(`Nullifying data for user ID: ${userId}...`);

                // Nullify user data in `user_analytics`
                await connection.execute(`
                    UPDATE user_analytics
                    SET user_id = NULL, user_ip = NULL
                    WHERE user_id = ? ${dateCondition}
                `, [userId, ...parameters]);

                // Nullify data in `security_logs`
                await connection.execute(`
                    UPDATE security_logs
                    SET user_id = NULL, user_ip = NULL, event_details = 'NULLIFIED'
                    WHERE user_id = ? ${dateCondition}
                `, [userId, ...parameters]);

                console.log(`User data for user_id ${userId} nullified.`);
            }
        } else {
            // Apply the mode to all users if no user_id is provided
            console.log(`Processing data for all users within the date range ${startDate} to ${endDate}...`);

            if (mode === 'anonymize') {
                // Pseudonymize data for all users in the `user_analytics` table
                await connection.execute(`
                    UPDATE user_analytics
                    SET user_id = pseudonymize(user_id), user_ip = NULL
                    WHERE 1=1 ${dateCondition}
                `, [...parameters]);

                // Pseudonymize data in `security_logs`
                await connection.execute(`
                    UPDATE security_logs
                    SET user_id = pseudonymize(user_id), user_ip = NULL, event_details = 'ANONYMIZED'
                    WHERE 1=1 ${dateCondition}
                `, [...parameters]);

                console.log('Data anonymized for all users.');
            } else if (mode === 'nullify') {
                // Nullify data for all users in `user_analytics`
                await connection.execute(`
                    UPDATE user_analytics
                    SET user_id = NULL, user_ip = NULL
                    WHERE 1=1 ${dateCondition}
                `, [...parameters]);

                // Nullify data in `security_logs`
                await connection.execute(`
                    UPDATE security_logs
                    SET user_id = NULL, user_ip = NULL, event_details = 'NULLIFIED'
                    WHERE 1=1 ${dateCondition}
                `, [...parameters]);

                console.log('Data nullified for all users.');
            }
        }
    } catch (error) {
        console.error('Error during data processing:', error.message);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Example usage: Call the function with options
// anonymize all users within a date range
processUserData({ mode: 'anonymize', startDate: '2023-01-01', endDate: '2023-12-31' }).catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
});

// anonymize specific user
processUserData({ mode: 'anonymize', userId: 1 }).catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
});

// nullify specific user
processUserData({ mode: 'nullify', userId: 2 }).catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
});
