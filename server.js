//Modules
const express = require('express');
const app = require('./app.js');
const bodyParser = require('body-parser');
const morgan = require('morgan');
jsend = require('jsend');

// =======================
// Configuration =========
// =======================
const port = process.env.PORT || 3000; // used to create, sign, and verify tokens

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// use morgan to log requests to the console
app.use(morgan('dev'));

// Functions utils
server_email = 'discover.pts3g9@gmail.com';

const db = require('./database.js');
email = require('./email.js');

// Connexion à la BDD
pool = db.getPool(); // get database instance

// Routes files
users = require('./routes/users');
posts = require('./routes/posts');
likes = require('./routes/likes');
comments = require('./routes/comments');
resetpassword = require('./routes/resetpassword');
friends = require('./routes/friends');
tags = require('./routes/tags');
images = require('./routes/images');
profiles = require('./routes/profiles');
contact = require('./routes/contact');
update = require('./routes/update');

// Langue de la requete
requestLanguage = "en";

getString = (stringKey, args = null) => {
    // If language request not exists
    if (!requestLanguage)
        requestLanguage = "en";

    let langStrings;
    // Get Strings array for the languages of the request
    if (requestLanguage == "fr")
        langStrings = require("./lang_fr");
    else
        langStrings = require("./lang_en");

    // Get the string ask
    let stringToReturn = langStrings[stringKey];
    // If string key doesn't exists
    if (!stringToReturn) {
        // Get the default error message
        stringToReturn = langStrings["error"];
    }

    // If %s to replace in string
    if (args)
        stringToReturn = stringToReturn.replace(/%s/g, () => args.shift());

    return stringToReturn + ".";
}

function onDatabaseError(res, message) {
    console.log(message);
    return res.status(500).send(jsend.error(message));
}
onDatabaseReqError = (res, message) => {
    onDatabaseError(res, message);
}
onDatabaseConError = (res) => {
    onDatabaseError(res, getString("error_database_con"));
}

app.use((req, res, next) => {
    let lang = req.headers["accept-language"];
    if (lang)
        requestLanguage = lang.substring(0, 2);

    req.user = undefined;
    if (req.headers && req.headers.authorization) {
        // On vérifie si notre bdd mysql fonctionne
        pool.getConnection((err, connection) => {
            if (err) {
                connection.release();
                onDatabaseConError(res);
            } else {
                connection.query('SELECT id_user FROM user WHERE token_user = ? LIMIT 1', [req.headers.authorization], (error, results, fields) => {
                    connection.release();
                    if (error) next();
                    else {
                        if (results.length > 0)
                            req.user = results[0].id_user;
                        next();
                    }
                });
            }
        });
    } else {
        next();
    }
});

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

let router = express.Router();

// ================
// ROUTES =========
// ================
router.get('/', (req, res) => res.json({ message: 'API Discover' }));

// Register a user
router.route('/users').post(users.register_user);
// Login a user
router.route('/users/login').post(users.login_user);
// Logout a user
router.route('/users/:id_user/logout').put(users.loginRequired, users.logout_user);

// Check Follow relation
router.route('/users/:id_user/checkfollow').get(users.loginRequired, friends.check_follow_user);
// Follow or unfollow user
router.route('/users/:id_user/follow').post(users.loginRequired, friends.follow_user);

// Get user profil info
router.route('/users/:id_user/info').get(users.loginRequired, profiles.get_profile_info);

// Update email user profil
router.route('/users/:id_user/edit/email').put(users.loginRequired, profiles.edit_profile_email);
// Update password user profil
router.route('/users/:id_user/edit/password').put(users.loginRequired, profiles.edit_profile_password);
// Update img user profil
router.route('/users/:id_user/edit/image').put(users.loginRequired, profiles.edit_profile_img);
// Update position user profil
router.route('/users/:id_user/edit/position').put(users.loginRequired, profiles.edit_profile_position);

// Search user
router.route('/users/search').get(users.search_user);
// Search user
router.route('/users/search/:search_user').get(users.search_user);

// Save new post
router.route('/posts').post(users.loginRequired, posts.save_post);
// Remove post
router.route('/posts/:id_post').delete(users.loginRequired, posts.delete_post);

// Get post by location
router.route('/posts/location').get(users.loginRequired, posts.get_posts_location);
// Get post of friends
router.route('/posts/friends').get(users.loginRequired, posts.get_posts_friends);
// Get all posts for map
router.route('/posts/map').get(users.loginRequired, posts.get_posts_map);
// Get all posts of user
router.route('/posts/user/:id_user').get(users.loginRequired, posts.get_posts_user);

// Get specific post
router.route('/posts/:id_post').get(users.loginRequired, posts.get_specific_post);

//Like or unlike a post
router.route('/posts/:id_post/likes').post(users.loginRequired, likes.like);

//Get comments of a post
router.route('/posts/:id_post/comments').get(users.loginRequired, comments.get_posts_comments);
//Save comment of a post
router.route('/posts/:id_post/comments').post(users.loginRequired, comments.save_post_comment);
//Delete comment of a post
router.route('/posts/:id_post/comments/:id_comment').delete(users.loginRequired, comments.delete_post_comment);

//Get all tags
router.route('/tags').get(tags.get_tags);

// Get image post
router.route('/images/posts/:image').get(images.get_post_original);
// Get image post thumbnail
router.route('/images/posts/:image/thumbnails').get(images.get_post_thumbnail);

// Get image profil
router.route('/images/profils/:image').get(images.get_profil_original);
// Get image profil thumbnail
router.route('/images/profils/:image/thumbnails').get(images.get_profil_thumbnail);

//Reset password
router.route('/resetpassword')
    .post(resetpassword.sendResetToken)
    .put(resetpassword.changeUserPassword);

//Send contact email
router.route('/contact').post(users.loginRequired, contact.sendEmailContact);

//Get last app version
router.route('/version').get(update.get_last_version);

// === REGISTER OUR ROUTES ===
app.use('/api', router);


// === START THE SERVER ===
app.listen(port, (error) => {
    console.log('Server listening at port %d', port);
});
