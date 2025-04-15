const User = require("../model/auth");

const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id, // Use the authenticated user's ID
      { profileImage: req.file.path },
      { new: true }
    ); 

    res.status(200).json({
      success: true,
      message: "Profile image updated!",
      profileImage: user.profileImage,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      error: error.message || "Server error",
    });
  }
};

module.exports = {
  uploadProfilePicture
};