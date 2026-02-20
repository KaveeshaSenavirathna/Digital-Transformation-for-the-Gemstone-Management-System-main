import React, { useState } from "react";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeList from "../components/EmployeeList";

function Employees() {
  const [refresh, setRefresh] = useState(false);

  return (
    <div>
      <h1>Employee Management</h1>
      <EmployeeForm onEmployeeAdded={() => setRefresh(!refresh)} />
      <EmployeeList refresh={refresh} />
    </div>
  );
}

export default Employees;
