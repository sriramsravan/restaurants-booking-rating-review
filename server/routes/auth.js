const express = require("express");
const router = express.Router();
const passport = require("passport");
const user = require("../models/user");

const authMiddleware = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.status(401).json({ message: "You are not authenticated" });
    } else {
        return next();
    }
};

router.post("/signin", (req, res, next) => {
    passport.authenticate("local", function (err, user, info) {
        if (err) {
            return res.status(400).json({ errors: err });
        }
        if (!user) {
            return res.status(400).json({ errors: "No user found" });
        }
        req.logIn(user, function (err) {
            if (err) {
                return res.status(400).json({ errors: err });
            }
            return res.status(200).json({ success: `logged in ${user.id}` });
        });
    })(req, res, next);
});
router.post("/signup", async (req, res) => {
    try {
        let out = await user.create(req.body)
        res.status(200).json({ message: 'User successfully created' });
    } catch (error) {
        res.status(400).json({ message: 'Please Login!!! You are registered already' })
    }

});

router.get("/me", authMiddleware, (req, res) => {
    res.status(200).json({ user: req.user.toAuthJSON() });
});

router.get("/logout", authMiddleware, (req, res) => {
    req.logout()
    res.status(200).json({ message: "logged out successfully" });
});


module.exports = router;