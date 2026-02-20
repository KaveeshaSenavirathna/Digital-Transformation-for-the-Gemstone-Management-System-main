const ProductionSalary = require("../../Models/Finance/ProductionSalaryModel");

// Create production salary rate
exports.createProductionSalary = async (req, res) => {
  try {
    const { stoneCode, type, pricePerPcs, description } = req.body;
    
    const productionSalary = new ProductionSalary({
      stoneCode,
      type,
      pricePerPcs,
      description
    });
    
    await productionSalary.save();
    res.status(201).json({ message: "Production salary rate created successfully", data: productionSalary });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Stone code already exists" });
    }
    res.status(500).json({ message: "Failed to create production salary rate", error: err.message });
  }
};

// Get all production salary rates
exports.getProductionSalaries = async (req, res) => {
  try {
    const { stoneCode, type, isActive } = req.query;
    const query = {};
    
    if (stoneCode) query.stoneCode = { $regex: stoneCode, $options: "i" };
    if (type) query.type = { $regex: type, $options: "i" };
    if (isActive !== undefined) query.isActive = isActive === "true";
    
    const salaries = await ProductionSalary.find(query).sort({ createdAt: -1 });
    res.status(200).json(salaries);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch production salary rates", error: err.message });
  }
};

// Get single production salary rate
exports.getProductionSalaryById = async (req, res) => {
  try {
    const salary = await ProductionSalary.findById(req.params.id);
    if (!salary) {
      return res.status(404).json({ message: "Production salary rate not found" });
    }
    res.status(200).json(salary);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch production salary rate", error: err.message });
  }
};

// Update production salary rate
exports.updateProductionSalary = async (req, res) => {
  try {
    const { stoneCode, type, pricePerPcs, description, isActive } = req.body;
    
    const salary = await ProductionSalary.findById(req.params.id);
    if (!salary) {
      return res.status(404).json({ message: "Production salary rate not found" });
    }
    
    // Check if stone code is being changed and if it already exists
    if (stoneCode && stoneCode !== salary.stoneCode) {
      const existingSalary = await ProductionSalary.findOne({ stoneCode, _id: { $ne: req.params.id } });
      if (existingSalary) {
        return res.status(400).json({ message: "Stone code already exists" });
      }
    }
    
    const updatedSalary = await ProductionSalary.findByIdAndUpdate(
      req.params.id,
      { stoneCode, type, pricePerPcs, description, isActive },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({ message: "Production salary rate updated successfully", data: updatedSalary });
  } catch (err) {
    res.status(500).json({ message: "Failed to update production salary rate", error: err.message });
  }
};

// Delete production salary rate
exports.deleteProductionSalary = async (req, res) => {
  try {
    const salary = await ProductionSalary.findByIdAndDelete(req.params.id);
    if (!salary) {
      return res.status(404).json({ message: "Production salary rate not found" });
    }
    res.status(200).json({ message: "Production salary rate deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete production salary rate", error: err.message });
  }
};
