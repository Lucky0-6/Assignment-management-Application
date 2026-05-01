const express=require('express');
const router=express.Router();
const verifyToken=require('../services/auth');

const userController=require('../controllers/UserController');

router.post('/execute-user',verifyToken, userController.UserController);
router.post('/execute-course',verifyToken, userController.CourseMasterController);
router.post('/execute-assignment',verifyToken, userController.AssignmentContoller);
router.post('/login',userController.handleLogin);

module.exports=router;
