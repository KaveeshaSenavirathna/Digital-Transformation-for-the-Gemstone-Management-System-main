import React from "react";
import { Route, Routes } from "react-router-dom";

import D_loging from "./Components/Home & Validations/Dashboard_login";
import Home from "./Components/Home & Validations/Home";
import DashboardLogsViewer from "./Components/Home & Validations/DashboardLogsViewer";

import EmpDashboard from "./Components/Employee/EmployeeDashboard";
import Newemployee from "./Components/Employee/EmployeeForm";
import Employeelist from "./Components/Employee/EmployeeList";
import Update from "./Components/Employee/Employeeupdate";
import PrintEmployeeIDCard from "./Components/Employee/PrintEmployeeIDCardPage";
import AttendanceNew from "./Components/Employee/AttendanceDaily";
import Attendanceist from "./Components/Employee/AttendanceList";
import Attendancesummery from "./Components/Employee/AttendanceSummary";
import Requests_emp from "./Components/Employee/Requests";
import Task from "./Components/Employee/Tasks";
import Performance from "./Components/Employee/Performance";
import Analytics from "./Components/Employee/Analytics";

import PandPDashboard from "./Components/Production & Process/PandPDashboard";
import DisplayProduction from "./Components/Production & Process/DisplayProcess";
import InsertProcess from "./Components/Production & Process/InsertProcess";
import PreformPage from "./Components/Production & Process/PreformPage";
import CalibratePage from "./Components/Production & Process/CalibratePage";
import CutPolishPage from "./Components/Production & Process/CutPolishPage";
import DOPPage from "./Components/Production & Process/DOPPage";
import RealTimeSimulation from "./Components/Production & Process/RealTimeSimulation";
import Outcome from "./Components/MainInventroy/LotOutcome";
import Raw_m from "./Components/MainInventroy/RawMeterials";
import View_Raw_m from "./Components/MainInventroy/ViewRawMaterial";

import Indashboard from "./Components/MainInventroy/InveventroyDashboard";
import NewSupply from "./Components/MainInventroy/InsertNewSupply";
import Newmanage from "./Components/MainInventroy/NewSupplyList";
import EditSupplyLot from "./Components/MainInventroy/EditSupplyLot";
import ViewSupplyLot from "./Components/MainInventroy/ViewSupply";
import NewSummery from "./Components/MainInventroy/NewSupplySummary";
import NewLot from "./Components/MainInventroy/CreateLot";
import NewLotlist from "./Components/MainInventroy/NewLotList";
import NewLotlistUpdate from "./Components/MainInventroy/EditNewLot";
import DisplayProcess from "./Components/MainInventroy/DisplayProcess";

import AdminDashboard from "./Components/CustomerOrder/AdminDashboard";
import Contact from "./Components/MarketPlace/Contact";
import Consultation from "./Components/MarketPlace/Consultation";
import About from "./Components/MarketPlace/About";
import Collections from "./Components/MarketPlace/Collections";
import ProductDetail from "./Components/MarketPlace/ProductDetail";
import Cart from "./Components/MarketPlace/Cart";
import Profile from "./Components/MarketPlace/Profile";
import Explore from "./Components/MarketPlace/Explore";
import RequestPage from "./Components/MarketPlace/RequestPage";
import Requesthistory from "./Components/MarketPlace/RequestHistory";
import Register from "./Components/MarketPlace/Register";
import Login_m from "./Components/MarketPlace/Login";
import Web from "./Components/MarketPlace/Home";
import Forgotpassword from "./Components/MarketPlace/ForgotPassword";
import ResetPassword from "./Components/MarketPlace/ResetPassword";

import Requests from "./Components/CustomerOrder/Requests";
import CustomerOrrder from "./Components/CustomerOrder/CustomerOrderMain";
import Placeoreder from "./Components/CustomerOrder/AdminDashboard";

import Financedashboard from "./Components/Finance/FinanceDashboard";
import WorkSummery from "./Components/Finance/WorkSummary";
import PayData from "./Components/Finance/PayData";
import Paysheet from "./Components/Finance/Paysheet";
import Materials from "./Components/Finance/Materials";

import Certificate from "./Components/certification/CertificateDashboard";
import CertificateVerification from "./Components/certification/CertificateVerification";


function App() {
  return (
    <div>
      <Routes>
        <Route path="/certificate" element={<Certificate />} />
        <Route path="/verify-certificate/:id" element={<CertificateVerification />} />


        <Route path="/WorkSummery" element={<WorkSummery />} />
        <Route path="/PayData" element={<PayData />} />
        <Route path="/Paysheet" element={<Paysheet />} />
        <Route path="/Materials" element={<Materials />} />
        <Route path="/financedashboard" element={<Financedashboard />} />


        <Route path="/Customer&Order" element={<CustomerOrrder />} />
        <Route path="/place" element={<Placeoreder />} />
        <Route path="/requests" element={<Requests />} />


        <Route path="/request_history" element={<Requesthistory />} />
        <Route path="/request/:productId" element={<RequestPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/about" element={<About />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/consultation" element={<Consultation />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login_web" element={<Login_m />} />
        <Route path="/web_home" element={<Web />} />
        <Route path="/forgot-password" element={<Forgotpassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        

        <Route path="/view_raw_m/:id" element={<View_Raw_m />} />
        <Route path="/raw_m" element={<Raw_m />} />
        <Route path="/outcome" element={<Outcome />} />
        <Route path="/displayprocess" element={<DisplayProcess />} />
        <Route path="/updatelot/:id" element={<NewLotlistUpdate />} />
        <Route path="/newlotlist" element={<NewLotlist />} />
        <Route path="/newlot" element={<NewLot />} />
        <Route path="/newsummery" element={<NewSummery />} />
        <Route path="/view/:id" element={<ViewSupplyLot />} />
        <Route path="/edit/:id" element={<EditSupplyLot />} />
        <Route path="/New_Manage" element={<Newmanage />} />
        <Route path="/New_Supply" element={<NewSupply />} />
        <Route path="/indashboard" element={<Indashboard />} />
        
        
        <Route path="/dop" element={<DOPPage />} />
        <Route path="/cutandpolish" element={<CutPolishPage />} />
        <Route path="/calibrate" element={<CalibratePage />} />
        <Route path="/preform" element={<PreformPage />} />
        <Route path="/insertprocess" element={<InsertProcess />} />
        <Route path="/displayproduction" element={<DisplayProduction />} />
        <Route path="/pandpdashboard" element={<PandPDashboard />} />
        <Route path="/realtimesimulation" element={<RealTimeSimulation />} />
        
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/performance" element={<Performance />} />
        <Route path="/task" element={<Task />} />
        <Route path="/requestsemp" element={<Requests_emp />} />
        <Route path="/attendancesummery" element={<Attendancesummery />} />
        <Route path="/attendancelist" element={<Attendanceist />} />
        <Route path="/attendancenew" element={<AttendanceNew />} />
        <Route path="/employees/print/:id" element={<PrintEmployeeIDCard />} />
        <Route path="/employees/update/:id" element={<Update />} />
        <Route path="/employees_list" element={<Employeelist />} />
        <Route path="/new_emp" element={<Newemployee />} />
        <Route path="/empdashboard" element={<EmpDashboard />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/adminpdashboard" element={<AdminDashboard />} />
        
        <Route path="/d_loging" element={<D_loging />} />
        <Route path="/dashboard-logs" element={<DashboardLogsViewer />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
