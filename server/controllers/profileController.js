const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Controller to get logged-in student's profile details
const getStudentProfile = async (req, res) => {
  try {
    // Extract user ID from the authenticated request
    const userId = req.user.id; // Assuming req.user is set after authentication

    // Find the user with accountType: "Student"
    const user = await User.findOne({
      _id: userId,
      accountType: "Student",
    }).select("firstName lastName image email additionalDetails courses").populate("additionalDetails courses");

    // Check if the user exists and has accountType "Student"
    if (!user) {
      return res.status(404).json({ message: "Student profile not found" });
    }

    // Respond with user details
    res.status(200).json({
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      image: user.image,
      additionalDetails: user.additionalDetails,
      courses: user.courses,
    });
  } catch (error) {
    console.error("Error fetching student profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTutorProfile = async (req, res) => {
  try {
    // Extract user ID from the authenticated request
    const userId = req.user.id; // Assuming req.user is set after authentication

    // Find the user with accountType: "Tutor"
    const user = await User.findOne({
      _id: userId,
      accountType: "Tutor",
    }).select("firstName lastName image email additionalDetails courses expertise");

    // Check if the user exists and has accountType "Tutor"
    if (!user) {
      return res.status(404).json({ message: "Tutor profile not found" });
    }

    // If the expertise field exists, populate it
    if (user.expertise) {
      await user.populate("expertise");
    }

    // Respond with user details
    res.status(200).json({
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      image: user.image,
      additionalDetails: user.additionalDetails,
      expertise: user.expertise || [], // Return an empty array if expertise doesn't exist
      courses: user.courses,
    });
  } catch (error) {
    console.error("Error fetching tutor profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Controller to update logged-in student's profile details
const updateStudentProfile = async (req, res) => {
  try {
    // Extract user ID from the authenticated request
    const userId = req.user.id; // Assuming req.user is set after authentication

    // Ensure the user is a student
    const user = await User.findOne({ _id: userId, accountType: "Student" });
    if (!user) {
      return res.status(404).json({ message: "Student profile not found" });
    }

    // Update the user's profile with the provided data
    const { firstName, lastName, image, additionalDetails } = req.body;

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (image) user.image = image;
    if (additionalDetails) user.additionalDetails = additionalDetails;

    await user.save();

    // Respond with the updated profile
    res.status(200).json({
      message: "Profile updated successfully",
      profile: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        image: user.image,
        additionalDetails: user.additionalDetails,
      },
    });
  } catch (error) {
    console.error("Error updating student profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const changePassword = async (req, res) => {
  try {
    // Extract user ID from the authenticated request
    const userId = req.user.id; // Assuming req.user is set after authentication

    // Ensure the user is a student
    const user = await User.findOne({ _id: userId, accountType: "Student" });
    if (!user) {
      return res.status(404).json({ message: "Student profile not found" });
    }

    // Get current password, new password, and confirm password from request body
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Check if the current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Check if the new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password with the hashed new password
    user.password = hashedPassword;
    await user.save();

    // Respond with success
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateTutorProfile = async (req, res) => {
  try {
    // Extract user ID from the authenticated request
    const userId = req.user.id; // Assuming req.user is set after authentication

    // Ensure the user is a tutor
    const user = await User.findOne({ _id: userId, accountType: "Tutor" });
    if (!user) {
      return res.status(404).json({ message: "Tutor profile not found" });
    }

    // Update the user's profile with the provided data
    const { firstName, lastName, image, additionalDetails, expertise } = req.body;

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (image) user.image = image;
    if (additionalDetails) user.additionalDetails = additionalDetails;
    if (expertise) user.expertise = expertise;  // Add expertise field update

    await user.save();

    // Respond with the updated profile
    res.status(200).json({
      message: "Profile updated successfully",
      profile: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        image: user.image,
        additionalDetails: user.additionalDetails,
        expertise: user.expertise, // Include expertise field in response
      },
    });
  } catch (error) {
    console.error("Error updating tutor profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const changeTutorPassword = async (req, res) => {
  try {
    // Extract user ID from the authenticated request
    const userId = req.user.id; // Assuming req.user is set after authentication

    // Ensure the user is a tutor
    const user = await User.findOne({ _id: userId, accountType: "Tutor" });
    if (!user) {
      return res.status(404).json({ message: "Tutor profile not found" });
    }

    // Get current password, new password, and confirm password from request body
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Check if the current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Check if the new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password with the hashed new password
    user.password = hashedPassword;
    await user.save();

    // Respond with success
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing tutor password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateProfileImage = async (req, res) => {
  try {
    // Extract user ID from the authenticated request
    const userId = req.user.id; // Assuming req.user is set after authentication

    // Extract the new image URL from the request body
    const { image } = req.body;

    // Validate input
    if (!image) {
      return res.status(400).json({ message: "Image URL is required" });
    }

    // Find and update the user's image
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.image = image;
    await user.save();

    // Respond with the updated image
    res.status(200).json({
      message: "Profile image updated successfully",
      image: user.image,
    });
  } catch (error) {
    console.error("Error updating profile image:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getStudentProfile, updateStudentProfile, changePassword, getTutorProfile,updateTutorProfile,changeTutorPassword,updateProfileImage };
