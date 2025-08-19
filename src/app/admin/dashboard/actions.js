"use server"

import User from "@/lib/models/User";
import connect from "@/lib/mongo";
import PlatformService from "@/lib/models/Service";
import axios from "axios";



const providerApiUrl = process.env.PROVIDER_API_URL;
const providerApiKey = process.env.PROVIDER_API_KEY;

export async function getBalanceFromApi() {
  try {
    const response = await axios.post(providerApiUrl, {
      key: providerApiKey,
      action: 'balance'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const { balance, currency } = response.data;

    return { balance, currency };
  } catch (error) {
    console.error('Error fetching balance:', error.message);
    throw new Error('Failed to fetch balance');
  }
}


export const getAllServices = async () => {
  try {
    const services = await PlatformService.find({}, 'name image description').lean();
    await connect();
    // Convert _id to string for each service
    const plainServices = services.map(service => ({
      ...service,
      _id: service._id.toString(),
    }));

    return {
      success: true,
      data: plainServices,
    };
  } catch (err) {
    console.error("Error fetching all services:", err);
    return {
      success: false,
      message: "Server error.",
    };
  }
};


// Helper: recursively convert mongoose docs/maps to plain JSON
function cleanDoc(doc) {
  if (Array.isArray(doc)) {
    return doc.map(cleanDoc);
  } else if (doc && typeof doc === "object" && !(doc instanceof Date)) {
    // Handle Map
    if (doc instanceof Map) {
      const obj = {};
      for (const [k, v] of doc.entries()) {
        obj[k] = cleanDoc(v);
      }
      return obj;
    }
    const newObj = {};
    for (const [key, value] of Object.entries(doc.toObject ? doc.toObject() : doc)) {
      if (key === "_id" || key.endsWith("Id")) {
        newObj[key] = value?.toString();
      } else {
        newObj[key] = cleanDoc(value);
      }
    }
    return newObj;
  }
  return doc;
}

//  Platforms - stuff 

// ---------------- Platform CRUD ----------------

// Get all platforms
export const getAllPlatforms = async () => {
  try {
    await connect();
    const platforms = await PlatformService.find({});
    return { success: true, data: cleanDoc(platforms) };
  } catch (err) {
    console.error("Error fetching platforms:", err);
    return { success: false, message: "Server error." };
  }
};

// Get platform by name (for detail page)
export const getPlatformById = async (platformName) => {
  try {
    await connect();
    const platform = await PlatformService.findOne({ name: platformName });
    if (!platform) {
      return { success: false, message: "Platform not found." };
    }
    return { success: true, data: cleanDoc(platform) };
  } catch (err) {
    console.error("Error fetching platform by name:", err);
    return { success: false, message: "Server error." };
  }
};

// Create new platform
export const createPlatform = async (formData) => {
  try {
    await connect();
    const newPlatform = new PlatformService({
      name: formData.name,
      image: formData.image,
      description: formData.description,
      categories: new Map(), // default empty categories
    });
    await newPlatform.save();

    return { success: true, data: cleanDoc(newPlatform) };
  } catch (err) {
    console.error("Error creating platform:", err);
    return { success: false, message: "Server error." };
  }
};

// Update platform
export const updatePlatform = async (id, updatedData) => {
  try {
    await connect();
    const updated = await PlatformService.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    if (!updated) return { success: false, message: "Platform not found." };

    return { success: true, data: cleanDoc(updated) };
  } catch (err) {
    console.error("Error updating platform:", err);
    return { success: false, message: "Server error." };
  }
};

// Delete platform
export const deletePlatform = async (id) => {
  try {
    await connect();
    const deleted = await PlatformService.findByIdAndDelete(id);
    if (!deleted) return { success: false, message: "Platform not found." };

    return { success: true, message: "Platform deleted." };
  } catch (err) {
    console.error("Error deleting platform:", err);
    return { success: false, message: "Server error." };
  }
};


// ---------------- CATEGORY CRUD ----------------
export const addCategory = async (platformId, categoryName) => {
  try {
    await connect();
    const platform = await PlatformService.findById(platformId);
    if (!platform) return { success: false, message: "Platform not found." };

    if (platform.categories.has(categoryName)) {
      return { success: false, message: "Category already exists." };
    }

    platform.categories.set(categoryName, []);
    await platform.save();

    return { success: true, data: cleanDoc(platform) };
  } catch (err) {
    console.error("Error adding category:", err);
    return { success: false, message: "Server error." };
  }
};

export const updateCategory = async (platformId, oldCategory, newCategory) => {
  try {
    await connect();
    const platform = await PlatformService.findById(platformId);
    if (!platform) return { success: false, message: "Platform not found." };

    if (!platform.categories.has(oldCategory)) {
      return { success: false, message: "Category not found." };
    }

    const services = platform.categories.get(oldCategory);
    platform.categories.delete(oldCategory);
    platform.categories.set(newCategory, services);
    await platform.save();

    return { success: true, data: cleanDoc(platform) };
  } catch (err) {
    console.error("Error updating category:", err);
    return { success: false, message: "Server error." };
  }
};

export const deleteCategory = async (platformId, categoryName) => {
  try {
    await connect();
    const platform = await PlatformService.findById(platformId);
    if (!platform) return { success: false, message: "Platform not found." };

    if (!platform.categories.has(categoryName)) {
      return { success: false, message: "Category not found." };
    }

    platform.categories.delete(categoryName);
    await platform.save();

    return { success: true, data: cleanDoc(platform) };
  } catch (err) {
    console.error("Error deleting category:", err);
    return { success: false, message: "Server error." };
  }
};

// ---------------- SERVICE CRUD ----------------
export const addServiceToCategory = async (platformId, categoryName, serviceData) => {
  try {
    await connect();
    const platform = await PlatformService.findById(platformId);
    if (!platform) return { success: false, message: "Platform not found." };

    if (!platform.categories.has(categoryName)) {
      return { success: false, message: "Category not found." };
    }

    const services = platform.categories.get(categoryName) || [];
    services.push(serviceData);
    platform.categories.set(categoryName, services);
    await platform.save();

    return { success: true, data: cleanDoc(platform) };
  } catch (err) {
    console.error("Error adding service:", err);
    return { success: false, message: "Server error." };
  }
};

export const updateServiceInCategory = async (platformId, categoryName, index, updatedService) => {
  try {
    await connect();
    const platform = await PlatformService.findById(platformId);
    if (!platform) return { success: false, message: "Platform not found." };

    if (!platform.categories.has(categoryName)) {
      return { success: false, message: "Category not found." };
    }

    const services = platform.categories.get(categoryName);
    if (index < 0 || index >= services.length) {
      return { success: false, message: "Service not found." };
    }

    services[index] = { ...services[index], ...updatedService };
    platform.categories.set(categoryName, services);
    await platform.save();

    return { success: true, data: cleanDoc(platform) };
  } catch (err) {
    console.error("Error updating service:", err);
    return { success: false, message: "Server error." };
  }
};

export const deleteServiceFromCategory = async (platformId, categoryName, index) => {
  try {
    await connect();
    const platform = await PlatformService.findById(platformId);
    if (!platform) return { success: false, message: "Platform not found." };

    if (!platform.categories.has(categoryName)) {
      return { success: false, message: "Category not found." };
    }

    const services = platform.categories.get(categoryName);
    if (index < 0 || index >= services.length) {
      return { success: false, message: "Service not found." };
    }

    services.splice(index, 1);
    platform.categories.set(categoryName, services);
    await platform.save();

    return { success: true, data: cleanDoc(platform) };
  } catch (err) {
    console.error("Error deleting service:", err);
    return { success: false, message: "Server error." };
  }
};


