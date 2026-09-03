import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    srNo: Number,
    serviceCategory: String,
    employeeName: String,
    cnic: String,
    email: String,
    joiningDate: Date,
    monthDays: Number,
    presentDays: Number,
    offeredSalary: Number,
    leaveDeduction: Number,
    basicPayAfterDeduction: Number,
    arrears: Number,
    overtime: Number,
    allowances: Number,
    advancesLoan: Number,
    grossSalary: Number,
    advancesLoanDeduction: Number,
    eobi: Number,
    otherDeduction: Number,
    whtDeduction: Number,
    totalDeductions: Number,
    netAmount: Number,
  },
  { timestamps: true },
);

export default mongoose.model("Employee", employeeSchema);
