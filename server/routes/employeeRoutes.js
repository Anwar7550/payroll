import express from "express";
import multer from "multer";
import XLSX from "xlsx";
import Employee from "../models/Employee.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// JoiningDate ke month ki poori days nikalna (e.g. September -> 30)
function daysInMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = XLSX.read(req.file.buffer, {
      type: "buffer",
      cellDates: true, // Excel dates ko JS Date object mein parse karta hai
    });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: 0 });

    const records = rows.map((row) => {
      const joiningDate = row.JoiningDate ? new Date(row.JoiningDate) : null;
      const monthDays = joiningDate ? daysInMonth(joiningDate) : 0;

      const offeredSalary = Number(row.OfferedSalary) || 0;
      const leaveDeduction = Number(row.LeaveDeduction) || 0;
      const arrears = Number(row.Arrears) || 0;
      const overtime = Number(row.Overtime) || 0;
      const allowances = Number(row.Allowances) || 0;
      const advancesLoan = Number(row.AdvancesLoan) || 0;

      // OfferedSalary - LeaveDeduction
      const basicPayAfterDeduction = offeredSalary - leaveDeduction;

      // Sab 7 fields add ho kar GrossSalary
      const grossSalary =
        offeredSalary +
        leaveDeduction +
        basicPayAfterDeduction +
        arrears +
        overtime +
        allowances +
        advancesLoan;

      const advancesLoanDeduction = Number(row.AdvancesLoanDeduction) || 0;
      const eobi = Number(row.EOBI) || 0;
      const otherDeduction = Number(row.OtherDeduction) || 0;
      const whtDeduction = Number(row.WHITDeduction) || 0;

      // Sab 4 fields add ho kar TotalDeductions
      const totalDeductions =
        advancesLoanDeduction + eobi + otherDeduction + whtDeduction;

      // GrossSalary - TotalDeductions
      const netAmount = grossSalary - totalDeductions;

      return {
        srNo: row.SrNo,
        serviceCategory: row.ServiceCategory,
        employeeName: row.EmployeeName,
        cnic: row.Cnic,
        email: row.Email,
        joiningDate,
        monthDays,
        presentDays: Number(row.PresentDays) || 0,
        offeredSalary,
        leaveDeduction,
        basicPayAfterDeduction,
        arrears,
        overtime,
        allowances,
        advancesLoan,
        grossSalary,
        advancesLoanDeduction,
        eobi,
        otherDeduction,
        whtDeduction,
        totalDeductions,
        netAmount,
      };
    });

    const saved = await Employee.insertMany(records);
    res.status(201).json({ count: saved.length, employees: saved });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Upload failed" });
  }
});

router.get("/", async (req, res) => {
  const employees = await Employee.find().sort({ createdAt: -1 });
  res.json(employees);
});

export default router;
