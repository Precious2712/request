const express = require("express");
const router = express.Router();
const { uploadProfilePicture } = require("../controller/upload");
const upload = require("../utils/multer");
const authMiddleware = require("../middleware/verifyCurrentUser"); 

// Protected route - requires authentication
router.post("/upload-profile-picture",
    authMiddleware,
    upload.single('profilePicture'),
    uploadProfilePicture
);

module.exports = router;