"use server"

import User from "@/lib/models/User";
import connect from "@/lib/mongo";

export async function getAllUsers() {
  try {
    await connect();
    
    const users = await User.find({})
      .select('-password') // Exclude password field for security
      .sort({ createdAt: -1 }) // Sort by newest first
      .lean(); // Convert to plain JavaScript objects for better performance
    
    // Serialize the data to ensure it's compatible with Client Components
    const serializedUsers = users.map(user => ({
      ...user,
      _id: user._id.toString(),
      createdAt: user.createdAt.toISOString()
    }));
    
    return {
      success: true,
      data: serializedUsers,
      count: serializedUsers.length
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    return {
      success: false,
      error: 'Failed to fetch users',
      message: error.message
    };
  }
}

export async function getUserById(userId) {
  try {
    await connect();
    
    const user = await User.findById(userId)
      .select('-password')
      .lean();
    
    if (!user) {
      return {
        success: false,
        error: 'User not found'
      };
    }
    
    // Serialize the data to ensure it's compatible with Client Components
    const serializedUser = {
      ...user,
      _id: user._id.toString(),
      createdAt: user.createdAt.toISOString()
    };
    
    return {
      success: true,
      data: serializedUser
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return {
      success: false,
      error: 'Failed to fetch user',
      message: error.message
    };
  }
}






export async function updateUser(userId, updateData) {
  try {
    await connect();
    
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return {
        success: false,
        error: 'User not found'
      };
    }
    
    return {
      success: true,
      data: user
    };
  } catch (error) {
    console.error('Error updating user:', error);
    return {
      success: false,
      error: 'Failed to update user',
      message: error.message
    };
  }
}

export async function deleteUser(userId) {
  try {
    await connect();
    
    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      return {
        success: false,
        error: 'User not found'
      };
    }
    
    return {
      success: true,
      message: 'User deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting user:', error);
    return {
      success: false,
      error: 'Failed to delete user',
      message: error.message
    };
  }
}
