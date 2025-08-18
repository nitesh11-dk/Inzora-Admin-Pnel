
"use server"
import connect from "@/lib/mongo";
import User from "@/lib/models/User";
import PlatformService from "@/lib/models/Service";
  
/**
 * Update or add a discount object for a specific user and serviceId.
 *
 * @param {string} userId - The user _id
 * @param {string|number} serviceId - The service ID
 * @param {number} discountValue - The discount percentage (1-100)
 * @returns {Promise<Object>} Updated user document
 */
export async function setUserDiscount(userId, serviceId, discountValue) {
    if (!userId || !serviceId) throw new Error("Missing userId or serviceId");
    if (typeof discountValue !== "number" || discountValue < 1 || discountValue > 100) {
      throw new Error("Discount must be a number between 1 and 100");
    }
  
    await connect();
  
    // Use lean() to avoid Mongoose document instances and circular refs
    const user = await User.findById(userId).lean();
    if (!user) throw new Error("User not found");
  
    // Since we used lean(), user is a plain object, so you can't call save() here
    // So instead, update directly using findByIdAndUpdate:
  
    let discount = user.discount || [];
  
    const existingDiscountIndex = discount.findIndex(d => d.serviceId.toString() === serviceId.toString());
  
    if (existingDiscountIndex !== -1) {
      discount[existingDiscountIndex].discount = discountValue;
    } else {
      discount.push({ serviceId, discount: discountValue });
    }
  
    // Update in DB and return the updated user as plain object
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { discount },
      { new: true, lean: true }
    );
  
    return {
      _id: updatedUser._id.toString(),
      discount: updatedUser.discount,
    };
  }

// Utility: clean Mongo _id from nested docs
function cleanDoc(doc) {
  if (!doc) return doc;
  const { _id, __v, ...rest } = doc;
  return rest;
}

// Delete a discount by serviceId
export async function deleteUserDiscount(userId, serviceId) {
  if (!userId || !serviceId) throw new Error("Missing userId or serviceId");

  await connect();

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $pull: { discount: { serviceId: serviceId } } },
    { new: true, lean: true }
  );

  if (!updatedUser) {
    throw new Error("User not found or discount not removed");
  }

  return {
    _id: updatedUser._id.toString(),
    discount: updatedUser.discount,
  };
}

export async function getAllPlatformsWithCategoriesAndServices() {
  try {
    await connect();

    const platforms = await PlatformService.find().lean();

    // ✅ Convert categories (plain object after .lean())
    const structured = platforms.map((platform) => {
      const categories = {};

      for (const [catName, services] of Object.entries(platform.categories || {})) {
        categories[catName] = services.map((svc) => cleanDoc(svc));
      }

      return {
        name: platform.name,
        image: platform.image,
        description: platform.description,
        categories,
      };
    });

    return structured;
  } catch (err) {
    console.error("Error fetching platforms with categories:", err);
    throw new Error("Failed to fetch services");
  }
}