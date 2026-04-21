import Item from "../models/Item.js";

const cleanupCompletedItems = async () => {
  try {
    const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const result = await Item.deleteMany({
      status: "completed",
      completedAt: { $lt: oneMonthAgo },
    });

    console.log(`${result.deletedCount} completed items deleted`);
  } catch (error) {
    console.error("Error cleaning up completed items:", error.message);
  }
};

export default cleanupCompletedItems;
