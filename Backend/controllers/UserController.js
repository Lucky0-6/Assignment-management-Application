const sql=require('../config/db');
const { executeProcedure } = require('../services/procedureExecutor');
const jwt = require('jsonwebtoken');

const SECRET_KEY = "mysecretkey"; // move to env later


// Reusable handler to avoid code duplication
const handleRequest = async (req, res) => {
    try {
        const { procID, ...params } = req.body;
        const result = await executeProcedure({ procID, params});

        let data;

        // Case 1: SQL returned JSON (FOR JSON)
        if (result.recordset[0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B']) {
            const raw = result.recordset[0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B'];
            data = JSON.parse(raw);
        }
        // Case 2: SQL returned a scalar (like -1 or ID)
        else {
            data = result.recordset[0];
        }

        res.json({
            success: true,
            data:data
        });
    } catch (error) {
        console.error('Error:', error.message);
        if (error.message === 'Invalid procID') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const UserController = async (req, res) => await handleRequest(req, res);
const CourseMasterController = async (req, res) => await handleRequest(req, res);
const AssignmentContoller = async (req, res) => await handleRequest(req, res);


// const handleLogin = async (req, res) => {
//     try{
//         const {mobile,password} = req.body;
//         const pool = await sql.connect();
//         const result = await sql.query`select 
//                                         UserId as userid
//                                         ,Username as username
//                                         ,mobileNumber as mobileNum
//                                         ,[password] as pass
//                                         ,[role] as role
//                                         from Userrolerights	
//                                         where deleted=0 
//                                         for json path`

//         const jsonString = result.recordset[0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B'];

//         const data = JSON.parse(jsonString);

//         if (data.length >0) {
//             const user = data[0];
//             console.log(user.mobileNum, user.pass);

//             if (user.pass !== password || user.mobileNum !== Number(mobile)) {
//                 return res.status(401).json({ success:false,error: 'Invalid credentials' });
//             };

//             if(user.pass === password && user.mobileNum === Number(mobile)){


//                 return res.json({
//                                     success: true,
//                                     user: user
//                                 });


//             }
//         } else {
//             console.log('No user found');
//         }


//     }catch(error){
//         console.error('Error:', error.message);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };
const handleLogin = async (req, res) => {
    try {
        const { mobile, password } = req.body;

        const result = await sql.query`
            select 
                UserId as userid,
                Username as username,
                mobileNumber as mobileNum,
                [password] as pass,
                [role] as role
            from Userrolerights	
            where deleted = 0
        `;

        const users = result.recordset;

        if (users.length > 0) {
            const user = users.find(u => 
                u.pass === password && u.mobileNum === Number(mobile)
            );

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            // ✅ CREATE TOKEN
            const token = jwt.sign(
                {
                    userid: user.userid,
                    mobile: user.mobileNum,
                    role: user.role
                },
                SECRET_KEY,
                { expiresIn: '1h' }
            );

            return res.json({
                success: true,
                token: token,
                user: {
                    userid: user.userid,
                    username: user.username,
                    role: user.role
                }
            });
        }

        return res.status(404).json({
            success: false,
            message: 'User not found'
        });

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    UserController,
    CourseMasterController,
    handleLogin,
    AssignmentContoller
};
