//assit the urls (or routes) we're looking for
const express = require('express');

//put expresses router method to the router variable
const router = express.Router();

//bring in the userController functions into this file
const userController = require('./controllers/userController')
const postController = require('./controllers/postController')
const followController = require('./controllers/followController')

//user related routes
router.get('/', userController.home);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/doesUsernameExist', userController.doesUsernameExist)

//profile related routes
router.get('/profile/:username', userController.ifUserExists, userController.sharedProfileData, userController.profilePostsScreen);
router.get('/profile/:username/followers', userController.ifUserExists, userController.sharedProfileData, userController.profileFollowersScreen);
router.get('/profile/:username/following', userController.ifUserExists, userController.sharedProfileData, userController.profileFollowingScreen);


//post related routes
router.get('/create-post', userController.mustBeLoggedIn, postController.viewCreateScreen)
router.post('/create-post', userController.mustBeLoggedIn, postController.create);
router.get('/post/:id', postController.viewSingle);
router.get('/post/:id/edit', userController.mustBeLoggedIn, postController.viewEditScreen);
router.post('/post/:id/edit', userController.mustBeLoggedIn, postController.edit);
router.post('/post/:id/delete', userController.mustBeLoggedIn, postController.delete);
router.post('/search', postController.search);

//follow related routes
router.post('/addFollow/:username', userController.mustBeLoggedIn, followController.addFollow);
router.post('/removeFollow/:username', userController.mustBeLoggedIn, followController.removeFollow);


module.exports = router;