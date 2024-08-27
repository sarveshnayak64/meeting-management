const connection = require('../config/connection')
const {promisify} = require('util')

const bcrypt = require('bcryptjs')

const promise_connection = promisify(connection.query).bind(connection)

exports.getUser = async ()=>{

    let query = "SELECT id, email_id, name FROM users WHERE type != 'admin'"
    return await promise_connection(query);
}

exports.login = async (email, password) => {
    try {
        // email = sanitizeInput(email);
        // password = sanitizeInput(password);

        const query = "SELECT id,password,type FROM users WHERE email_id = ?";
        const [rows] = await promise_connection(query, [email]);

        if (rows.length === 0) {
            return {
                status: false
            };
        }

        const hashedPassword = rows.password;

        const isMatch = await bcrypt.compare(password, hashedPassword);

        if (!isMatch) {
            return {
                status: false
            };
        }

        return {
            status: true,
            userType: rows.type,
            userId: rows.id
        };
    } catch (error) {
        console.error('Login error:', error);
        return {
            status: false
        }; 
    }
}


exports.googleLogin = async (email, name, token) => {
    try {
        // Step 1: Check if the user exists
        const selectQuery = "SELECT id, type FROM users WHERE email_id = ?";
        const rows = await promise_connection(selectQuery, [email]);

        if (rows.length > 0) {
            const userId = rows[0].id;

            // Step 2: If user exists, update the token
            const updateQuery = "UPDATE users SET google_token = ? WHERE id = ?";
            await promise_connection(updateQuery, [token, userId]);

            return {
                status: true,
                userType: rows[0].type,
                userId: userId,
                message: "User authenticated and token updated."
            };
        } else {
            // Step 3: If user does not exist, create a new user
            const insertQuery = "INSERT INTO users (email_id, name, google_token, type) VALUES (?, ?, ?, ?)";
            const result = await promise_connection(insertQuery, [email, name, token, 'user']); // Assuming 'user' as a default type

            return {
                status: true,
                userType: 'user',
                userId: result.insertId,
                message: "New user created and authenticated."
            };
        }
    } catch (error) {
        console.error('Login error:', error);
        return {
            status: false,
            message: 'An error occurred during the login process.'
        };
    }
};

exports.createUser = async (name, email, password) => {
    try {
        const checkQuery = 'SELECT * FROM users WHERE email_id = ?';
        const [existingUser] = await promise_connection(checkQuery, [email]);
        console.log('execur ', existingUser)
        
        if (existingUser || existingUser?.length > 0) {
            return {
                status: false,
                message: "User already exists"
            };
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const insertQuery = `
            INSERT INTO users (name, email_id, password, type)
            VALUES (?, ?, ?, 'user')
        `;

        const result = await promise_connection(insertQuery, [name, email, hashedPassword]);

        return {
            status: true,
            message: "User Created Successfully",
            id: result.insertId
        }; 
    } catch (error) {
        console.error('Error creating user:', error);
        return {
            status: false,
            message: "Failed to create user"
        };
    }
};

exports.deleteUser = async (id) => {
    try {
        const checkQuery = 'DELETE FROM users WHERE id = ?';
        const existingUser = await promise_connection(checkQuery, [id]);

        if (existingUser) {
            return {
                status: true,
                message: "Deleted user successfully"
            };
        }else{
            return {
                status: false,
                message: "Failed to delete user"
            };
        }

    } catch (error) {
        console.error('Error creating user:', error);
        return {
            status: false,
            message: "Failed to delete user"
        };
    }
};