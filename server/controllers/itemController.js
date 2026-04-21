import Item from "../models/Item.js";
import { Readable } from "stream";
import cloudinary from "../config/cloudinary.js";

export const createItem = async (request, response) => {
  try {
    const {
      title,
      description,
      category,
      location,
      date,
      phone,
      region,
      whatsapp,
      proofRequired,
      verificationNote,
      uniqueIdentifier,
      handoverInstructions,
    } = request.body || {};

    const missingFields = [
      !title && "title",
      !description && "description",
      !category && "category",
      !location && "location",
      !date && "date",
      !phone && "phone",
      !region && "region",
      !whatsapp && "whatsapp",
    ].filter(Boolean);

    if (missingFields.length > 0) {
      return response.status(400).json({
        message: "All fields are required",
        missingFields,
      });
    }

    const allowedCategories = ["lost", "found"];
    if (!allowedCategories.includes(category)) {
      return response
        .status(400)
        .json({ message: "Category must be either lost or found" });
    }

    const phoneRegex = /^[0-9]{10}$/;

    if (!phoneRegex.test(phone)) {
      return response
        .status(400)
        .json({ message: "Phone number must be 10 digits" });
    }

    if (!phoneRegex.test(whatsapp)) {
      return response
        .status(400)
        .json({ message: "WhatsApp number must be 10 digits" });
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return response.status(400).json({ message: "Invalid date" });
    }

    let uploadedImageUrl = "";

    if (request.file) {
      const uploadFromBuffer = () =>
        new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "findit-items" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            },
          );

          Readable.from(request.file.buffer).pipe(uploadStream);
        });

      const uploadedImage = await uploadFromBuffer();
      uploadedImageUrl = uploadedImage.secure_url;
    }

    const newItem = new Item({
      title,
      description,
      imageUrl: uploadedImageUrl,
      category,
      location,
      date: parsedDate,
      phone,
      region,
      whatsapp,
      userId: request.user._id,
      proofRequired,
      verificationNote,
      uniqueIdentifier,
      handoverInstructions,
    });

    const savedItem = await newItem.save();

    response
      .status(201)
      .json({ message: "Item created successfully", item: savedItem });
  } catch (error) {
    console.error("Error creating item:", error);
    response.status(500).json({ error: "Failed to create item" });
  }
};

export const updateItem = async (request, response) => {
  try {
    const {
      title,
      description,
      category,
      location,
      date,
      phone,
      region,
      whatsapp,
      proofRequired,
      verificationNote,
      uniqueIdentifier,
      handoverInstructions,
    } = request.body || {};

    const missingFields = [
      !title && "title",
      !description && "description",
      !category && "category",
      !location && "location",
      !date && "date",
      !phone && "phone",
      !region && "region",
      !whatsapp && "whatsapp",
    ].filter(Boolean);

    if (missingFields.length > 0) {
      return response.status(400).json({
        message: "All fields are required",
        missingFields,
      });
    }

    const allowedCategories = ["lost", "found"];
    if (!allowedCategories.includes(category)) {
      return response
        .status(400)
        .json({ message: "Category must be either lost or found" });
    }

    const phoneRegex = /^[0-9]{10}$/;

    if (!phoneRegex.test(phone)) {
      return response
        .status(400)
        .json({ message: "Phone number must be 10 digits" });
    }

    if (!phoneRegex.test(whatsapp)) {
      return response
        .status(400)
        .json({ message: "WhatsApp number must be 10 digits" });
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return response.status(400).json({ message: "Invalid date" });
    }

    const item = await Item.findById(request.params.id);

    if (!item) {
      return response.status(404).json({ message: "Item not found" });
    }

    if (item.userId.toString() !== request.user._id.toString()) {
      return response
        .status(403)
        .json({ message: "You are not allowed to edit this item" });
    }

    let uploadedImageUrl = item.imageUrl;

    if (request.file) {
      const uploadFromBuffer = () =>
        new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "findit-items" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            },
          );

          Readable.from(request.file.buffer).pipe(uploadStream);
        });

      const uploadedImage = await uploadFromBuffer();
      uploadedImageUrl = uploadedImage.secure_url;
    }

    item.title = title;
    item.description = description;
    item.category = category;
    item.location = location;
    item.date = parsedDate;
    item.phone = phone;
    item.region = region;
    item.whatsapp = whatsapp;
    item.imageUrl = uploadedImageUrl;
    item.proofRequired = proofRequired ?? item.proofRequired;
    item.verificationNote = verificationNote ?? item.verificationNote;
    item.uniqueIdentifier = uniqueIdentifier ?? item.uniqueIdentifier;
    item.handoverInstructions =
      handoverInstructions ?? item.handoverInstructions;

    const updatedItem = await item.save();

    response.status(200).json({
      message: "Item updated successfully",
      item: updatedItem,
    });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};

export const getItems = async (request, response) => {
  try {
    // filter items by category if category query parameter is provided in the request
    const { category, region, search, status } = request.query;

    let filter = {};

    if (category) {
      filter.category = category;
    }

    if (region) {
      filter.region = region;
    }

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }
    if (status) {
      filter.status = status;
    }

    const items = await Item.find(filter).sort({ createdAt: -1 });
    response.status(200).json(items);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};

export const getItemById = async (request, response) => {
  try {
    const { id } = request.params;

    const item = await Item.findById(id);

    if (!item) {
      return response.status(404).json({ message: "Item not found" });
    }

    response.status(200).json(item);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};

export const updateItemStatus = async (request, response) => {
  try {
    const { status } = request.body;

    if (!status) {
      return response.status(400).json({ message: "Status is required" });
    }

    const allowedStatus = ["open", "in-progress", "completed"];

    if (!allowedStatus.includes(status)) {
      return response.status(400).json({ message: "Invalid status value" });
    }

    const item = await Item.findById(request.params.id);

    if (!item) {
      return response.status(404).json({ message: "Item not found" });
    }

    if (item.userId.toString() !== request.user._id.toString()) {
      return response
        .status(403)
        .json({ message: "You are not allowed to update this item" });
    }

    item.status = status;
    item.completedAt = status === "completed" ? new Date() : null;

    await item.save();

    response.status(200).json({ message: "Status updated successfully", item });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};

export const getCompletedItem = async (request, response) => {
  try {
    const { category, region, search } = request.query;

    let filter = { status: "completed" };

    if (category) {
      filter.category = category;
    }

    if (region) {
      filter.region = region;
    }

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const items = await Item.find(filter).sort({ createdAt: -1 });
    response.status(200).json(items);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};

export const deletItem = async (request, response) => {
  try {
    const item = await Item.findById(request.params.id);

    if (!item) {
      return response.status(404).json({ message: "Item not Found" });
    }

    if (item.userId.toString() !== request.user._id.toString()) {
      return response
        .status(403)
        .json({ message: "You are not allowed to delete thid items" });
    }

    await item.deleteOne();

    response.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};

export const myItems = async (request, response) => {
  try {
    const userId = request.user._id;

    const items = await Item.find({ userId }).sort({ createdAt: -1 });

    response.status(200).json(items);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};
