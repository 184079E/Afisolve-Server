const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router();

const {poolPromise} = require('../helpers/mssql-server-connection');
const {sql} = require('../helpers/mssql-server-connection');

router.get('/', (req, res) => {
    res.send('From authentication route');
});

router.post('/register', async (request, response) => {

    const data = request.body;

    try {
        const pool = await poolPromise;
        await pool.request()
            .input('_username', sql.VarChar(50), data.userName)
            .input('_email', sql.VarChar(100), data.email)
            .input('_subscribe', sql.VarChar(20), data.subscribe)
            .input('_password', sql.VarChar(20), data.password)
            .input('_role', sql.VarChar(20), data.role)
            .execute('registerUser', (error, result) => {
                if (error) {
                    console.log(error.number);
                    if (error.number === 2601) {
                        response.status(401).send({
                            status: false,
                            message: 'Existing User'
                        });
                    } else {
                        response.status(500).send({
                            status: false,
                            message: 'query Error..!'
                        });
                    }

                } else {
                    console.log(result);
                    if (result.returnValue === 0) {
                        console.log('Data Successfully Entered!');
                        let payload = {
                            username: result.recordset[0].username,
                            role: result.recordset[0].role
                        }
                        let token = jwt.sign(payload, 'secretKey');
                        response.status(200).send({
                            status: true,
                            message: 'Data Successfully Entered!',
                            token: token,
                            role: result.recordset[0].role
                        });
                    } else {
                        response.status(500).send({message: 'DB Server Error'});
                    }
                }
            });
    } catch (error) {
        console.log(error);
        response.status(500).send({
            status: false,
            message: 'DB connection Error..!'
        });
    }

});

router.post('/login', async (request, response) => {
    console.log(request.body);
    const data = request.body;

    try {
        const pool = await poolPromise;
        await pool.request()
            .input('username', sql.VarChar(50), data.userName)
            .input('password', sql.VarChar(20), data.password)
            .query('SELECT username,role FROM Users WHERE username = @username AND password = @password', (error, result) => {
                if (error) {
                    console.log(error);
                    response.status(500).send({
                        status: false,
                        message: 'DB Server error..!'
                    });
                } else {
                    if (result.recordset.length !== 0) {
                        console.log('login successful..!');
                        let payload = {
                            username: result.recordset[0].username,
                            role: result.recordset[0].role
                        }
                        let token = jwt.sign(payload, 'secretKey')
                        response.status(200).send({
                            status: true,
                            message: 'Login successful..!',
                            dbResult: result.recordset,
                            token: token,
                            role: result.recordset[0].role
                        })
                    } else {
                        console.log('Invalid username or password');
                        response.status(401).send({
                            status: false,
                            message: 'Invalid username or password'
                        })
                    }
                }
            });

    } catch (error) {
        console.log(error);
        response.status(500).send({
            status: false,
            message: 'Server error..!'
        });
    }

});

module.exports = router;