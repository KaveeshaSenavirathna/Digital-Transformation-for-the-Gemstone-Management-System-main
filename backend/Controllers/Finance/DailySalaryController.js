const DailySalary = require("../../Models/Finance/DailySalaryModel");
const Employee = require("../../Models/Employee/EmployeeModel");

// Create daily salary rate
exports.createDailySalary = async (req, res) => {
  try {
    const { employeeId, dailyRate, effectiveDate } = req.body;
    
    // Verify employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    
    // Deactivate any existing active rate for this employee
    await DailySalary.updateMany(
      { employeeId, isActive: true },
      { isActive: false }
    );
    
    const dailySalary = new DailySalary({
      employeeId,
      employeeName: employee.name,
      registrationId: employee.registrationId,
      department: employee.department,
      designation: employee.designation,
      dailyRate,
      effectiveDate: effectiveDate || new Date()
    });
    
    await dailySalary.save();
    res.status(201).json({ message: "Daily salary rate created successfully", data: dailySalary });
  } catch (err) {
    res.status(500).json({ message: "Failed to create daily salary rate", error: err.message });
  }
};

// Get all daily salary rates
exports.getDailySalaries = async (req, res) => {
  try {
    const { employeeId, department, designation, isActive } = req.query;
    const query = {};
    
    if (employeeId) query.employeeId = employeeId;
    if (department) query.department = department;
    if (designation) query.designation = designation;
    if (isActive !== undefined) query.isActive = isActive === "true";
    
    const salaries = await DailySalary.find(query)
      .populate('employeeId', 'name registrationId department designation')
      .sort({ createdAt: -1 });
    res.status(200).json(salaries);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch daily salary rates", error: err.message });
  }
};

// Get single daily salary rate
exports.getDailySalaryById = async (req, res) => {
  try {
    const salary = await DailySalary.findById(req.params.id).populate('employeeId', 'name registrationId department designation');
    if (!salary) {
      return res.status(404).json({ message: "Daily salary rate not found" });
    }
    res.status(200).json(salary);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch daily salary rate", error: err.message });
  }
};

// Update daily salary rate
exports.updateDailySalary = async (req, res) => {
  try {
    const { dailyRate, effectiveDate, isActive } = req.body;
    
    const salary = await DailySalary.findById(req.params.id);
    if (!salary) {
      return res.status(404).json({ message: "Daily salary rate not found" });
    }
    
    const updatedSalary = await DailySalary.findByIdAndUpdate(
      req.params.id,
      { dailyRate, effectiveDate, isActive },
      { new: true, runValidators: true }
    ).populate('employeeId', 'name registrationId department designation');
    
    res.status(200).json({ message: "Daily salary rate updated successfully", data: updatedSalary });
  } catch (err) {
    res.status(500).json({ message: "Failed to update daily salary rate", error: err.message });
  }
};

// Delete daily salary rate
exports.deleteDailySalary = async (req, res) => {
  try {
    const salary = await DailySalary.findByIdAndDelete(req.params.id);
    if (!salary) {
      return res.status(404).json({ message: "Daily salary rate not found" });
    }
    res.status(200).json({ message: "Daily salary rate deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete daily salary rate", error: err.message });
  }
};

// Get active daily salary for employee
exports.getActiveDailySalary = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const salary = await DailySalary.findOne({ employeeId, isActive: true })
      .populate('employeeId', 'name registrationId department designation');
    
    if (!salary) {
      return res.status(404).json({ message: "No active daily salary rate found for this employee" });
    }
    
    res.status(200).json(salary);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch active daily salary rate", error: err.message });
  }
};
