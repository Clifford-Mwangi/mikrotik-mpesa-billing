import Plan from "../models/Plan.js";

export const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createDefaultPlans = async () => {
  try {
    const defaults = [
      { name: "1 Hour Access", price: 10, durationHours: 1 },
      { name: "4 Hours Access", price: 35, durationHours: 4 },
      { name: "24 Hours Access", price: 50, durationHours: 24 },
    ];

    const count = await Plan.countDocuments();
    if (count === 0) {
      await Plan.insertMany(defaults);
      console.log("✅ Default plans created");
    } else {
      console.log("✅ Default plans already exist");
    }
  } catch (err) {
    console.error("❌ Error creating default plans:", err);
  }
};
