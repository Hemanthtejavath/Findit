import mongoose from "mongoose";

// Define the schema for the Item model

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      enum: ["lost", "found"],
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },
    region: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },

    whatsapp: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["open", "in-progress", "completed"],
      default: "open",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },

    // NEW VERIFICATION FIELDS
    proofRequired: {
      type: Boolean,
      default: false,
    },
    verificationNote: {
      type: String,
      trim: true,
      default: "",
    },
    uniqueIdentifier: {
      type: String,
      trim: true,
      default: "",
    },
    handoverInstructions: {
      type: String,
      trim: true,
      default: "",
    },
  },

  {
    timestamps: true,
  },
);

const Item = mongoose.model("Item", itemSchema);

export default Item;
