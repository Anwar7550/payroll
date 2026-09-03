import { useState, useEffect } from "react";

const navigation = ["Emp Management"];

const columns = [
  { key: "srNo", label: "SrNo" },
  { key: "serviceCategory", label: "Category" },
  { key: "employeeName", label: "Emp Name" },
  { key: "cnic", label: "Cnic" },
  { key: "email", label: "Email" },
  { key: "joiningDate", label: "Joining Date" },
  { key: "monthDays", label: "Month Days" },
  { key: "presentDays", label: "Present Days" },
  { key: "offeredSalary", label: "Offered Salary" },
  { key: "leaveDeduction", label: "Leave Deduction" },
  { key: "basicPayAfterDeduction", label: "Basic Pay After Deduction" },
  { key: "arrears", label: "Arrears" },
  { key: "overtime", label: "Overtime" },
  { key: "allowances", label: "Allowances" },
  { key: "advancesLoan", label: "Advances Loan" },
  { key: "grossSalary", label: "Gross Salary" },
  { key: "advancesLoanDeduction", label: "Advances Loan Deduction" },
  { key: "eobi", label: "EOBI" },
  { key: "otherDeduction", label: "Other Deduction" },
  { key: "whtDeduction", label: "WHT Deduction" },
  { key: "totalDeductions", label: "Total Deductions" },
  { key: "netAmount", label: "Net Amount" },
];

const EmployeeManagement = () => {
  const [activeSection, setActiveSection] = useState("Employees");
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const fetchEmployees = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/employees");
      const data = await response.json();
      setEmployees(data || []);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
      setEmployees([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFile(file.name);
    setUploadMessage("");
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "http://localhost:5000/api/employees/upload",
        {
          method: "POST",
          body: formData,
        },
      );
      const data = await response.json();
      setUploadMessage(`${data.count} records imported successfully`);
      await fetchEmployees();
    } catch (error) {
      setUploadMessage(
        error.response?.data?.message || error.message || "Upload failed",
      );
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const formatDate = (value) => {
    if (!value) return "-";
    return new Date(value).toLocaleDateString("en-GB"); // dd/mm/yyyy
  };

  const formatCell = (employee, key) => {
    if (key === "joiningDate") return formatDate(employee[key]);
    return employee[key] ?? "-";
  };

  return (
    <main className="dashboard-shell">
      <aside className="sidebar">
        <div className="brand-lockup">
          <span className="brand-mark">P</span>
          <div>
            <strong>payroll</strong>
            <span>people operations</span>
          </div>
        </div>

        <div className="workspace-label">Workspace</div>
        <nav className="side-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <button
              className={
                activeSection === item ? "nav-item active" : "nav-item"
              }
              key={item}
              onClick={() => setActiveSection(item)}
              type="button"
            >
              <span className="nav-icon">01</span>
              {item}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-avatar">AK</div>
          <div>
            <strong>Admin account</strong>
            <span>admin@payroll.co</span>
          </div>
          <button
            className="more-button"
            type="button"
            aria-label="Account options"
          >
            ...
          </button>
        </div>
      </aside>
      <section className="dashboard-content">
        <header className="topbar">
          <div>
            <h1>{activeSection}</h1>
          </div>
        </header>

        <div className="content-inner">
          <section className="table-panel">
            <div className="table-heading">
              <div>
                <h3>All employees</h3>
              </div>
              <label className="upload-button">
                <input
                  accept=".xls,.xlsx"
                  onChange={handleFileUpload}
                  type="file"
                  disabled={isUploading}
                />
                <span>{isUploading ? "Uploading..." : "Upload Excel"}</span>
                <b>+</b>
              </label>
            </div>
            {uploadedFile && (
              <p className="upload-status">
                Ready to import: <strong>{uploadedFile}</strong>
              </p>
            )}
            {uploadMessage && <p className="upload-status">{uploadMessage}</p>}

            <div className="table-wrap" style={{ overflowX: "auto" }}>
              <table>
                <thead>
                  <tr>
                    {columns.map((col) => (
                      <th key={col.key}>{col.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={columns.length}>Loading employees...</td>
                    </tr>
                  ) : employees.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length}>
                        No employees found. Upload an Excel file to import.
                      </td>
                    </tr>
                  ) : (
                    employees.map((employee) => (
                      <tr key={employee._id}>
                        {columns.map((col) => (
                          <td key={col.key}>{formatCell(employee, col.key)}</td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
};

export default EmployeeManagement;
