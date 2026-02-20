import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import "./Dashboard_login.css";
import { ReactComponent as UserIcon } from "../Galary/icons/user.svg";
import { ReactComponent as LockIcon } from "../Galary/icons/lock.svg";
import dashboardLogger from "../utils/dashboardLogger";

// Contract
// Inputs: regId (string), password (string)
// Outputs: on success navigate to /inventoryDashboard and save minimal session info
// Error modes: inline validation messages, server-like auth failure message

// Backend-authenticated login/registration

// Employee designations from the employee model
const EMPLOYEE_DESIGNATIONS = [
  "Director",
  "HR Executive",
  "factory_Manager",
  "Production_Manager",
  "quality_assurance_officer",
  "accountent",
  "systemmanager",
  "Office Assistant",
  "Gem Cutter (Cut & Polish)",
  "Gem_calibarater",
  "Gem_preform",
  "dopper",
  "Cleaning_Officer",
  "Trainer"
];

const DEPARTMENTS = [
  "human_resoure",
  "prduction&process", 
  "quality_assurance",
  "dministration",
  "finance"

];

function LoginInventory() {
  const navigate = useNavigate();
  const [registrationIdLogin, setRegistrationIdLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [forgotRegId, setForgotRegId] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotSending, setForgotSending] = useState(false);
  
  // Registration states
  const [showRegistration, setShowRegistration] = useState(false);
  const [registrationForm, setRegistrationForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    regId: "",
    password: "",
    confirmPassword: "",
    designation: "",
    department: "",
    position: ""
  });
  const [registrationErrors, setRegistrationErrors] = useState({});
  const [registrationSuccess, setRegistrationSuccess] = useState("");

  // Validate a single registration field (used onChange/onBlur)
  const validateRegistrationField = (fieldName, fieldValue, currentForm) => {
    const value = (typeof fieldValue === "string" ? fieldValue : "").toString();
    const form = currentForm || registrationForm;
    switch (fieldName) {
      case "firstName":
        if (!value.trim()) return "First name is required.";
        if (value.trim().length < 2) return "First name must be at least 2 characters.";
        return "";
      case "lastName":
        if (!value.trim()) return "Last name is required.";
        if (value.trim().length < 2) return "Last name must be at least 2 characters.";
        return "";
      case "email":
        if (!value.trim()) return "Email is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email address.";
        return "";
      case "phone":
        if (!value.trim()) return "Phone number is required.";
        if (!/^[\+]?[1-9][\d]{0,10}$/.test(value.replace(/[\s\-\(\)]/g, ''))) return "Please enter a valid phone number.";
        return "";
      case "regId":
        if (!value.trim()) return "Registration ID is required.";
        if (value.trim().length < 3) return "Registration ID must be at least 3 characters.";
        return "";
      case "password":
        if (!value) return "Password is required.";
        if (value.length < 6) return "Password must be at least 6 characters.";
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) return "Password must contain at least one uppercase letter, one lowercase letter, and one number.";
        // if confirmPassword present, revalidate it for match
        if (form.confirmPassword && form.confirmPassword !== value) return registrationErrors.confirmPassword || "";
        return "";
      case "confirmPassword":
        if (!value) return "Please confirm your password.";
        if (form.password !== value) return "Passwords do not match.";
        return "";
      case "designation":
        if (!value) return "Please select a designation.";
        return "";
      case "department":
        if (!value) return "Please select a department.";
        return "";
      case "position":
        if (!value.trim()) return "Position is required.";
        if (value.trim().length < 2) return "Position must be at least 2 characters.";
        return "";
      default:
        return "";
    }
  };

  // Log dashboard access when component mounts
  useEffect(() => {
    dashboardLogger.logDashboardAccess("Login Page", null, "GUEST");
  }, []);

  const validate = () => {
    const e = {};
    if (!registrationIdLogin.trim()) e.registrationIdLogin = "Registration ID is required.";
    else if (registrationIdLogin.trim().length < 3) e.registrationIdLogin = "Registration ID must be at least 3 characters.";

    if (!password) e.password = "Password is required.";
    else if (password.length < 5) e.password = "Password must be at least 5 characters.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateRegistration = () => {
    const e = {};
    const form = registrationForm;

    // First Name validation
    if (!form.firstName.trim()) e.firstName = "First name is required.";
    else if (form.firstName.trim().length < 2) e.firstName = "First name must be at least 2 characters.";

    // Last Name validation
    if (!form.lastName.trim()) e.lastName = "Last name is required.";
    else if (form.lastName.trim().length < 2) e.lastName = "Last name must be at least 2 characters.";

    // Email validation
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Please enter a valid email address.";

    // Phone validation
    if (!form.phone.trim()) e.phone = "Phone number is required.";
    else if (!/^[\+]?[1-9][\d]{0,15}$/.test(form.phone.replace(/[\s\-\(\)]/g, ''))) e.phone = "Please enter a valid phone number.";

    // Registration ID validation (optional client-side only)
    if (!form.regId.trim()) e.regId = "Registration ID is required.";
    else if (form.regId.trim().length < 3) e.regId = "Registration ID must be at least 3 characters.";

    // Password validation
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 6) e.password = "Password must be at least 6 characters.";
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) e.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number.";

    // Confirm Password validation
    if (!form.confirmPassword) e.confirmPassword = "Please confirm your password.";
    else if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match.";

    // Designation validation
    if (!form.designation) e.designation = "Please select a designation.";

    // Department validation
    if (!form.department) e.department = "Please select a department.";

    // Position validation
    if (!form.position.trim()) e.position = "Position is required.";
    else if (form.position.trim().length < 2) e.position = "Position must be at least 2 characters.";

    setRegistrationErrors(e);
    return Object.keys(e).length === 0;
  };

  // remove fake auth; use backend

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    try {
      setLoading(true);
      const res = await api.post("/api/dashboard-registration/login", { 
        registrationId: registrationIdLogin.trim(), 
        password 
      });
      const { token, user } = res.data || {};
      
      // Persist auth
      localStorage.setItem("authToken", token);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userName", user.name || "");
      localStorage.setItem("userEmail", user.email || "");
      localStorage.setItem("userRegistrationId", user.registrationId || "");
      localStorage.setItem("userDepartment", user.department || "");
      localStorage.setItem("userDesignation", user.designation || "");
      sessionStorage.setItem("userRole", user.role || "DASHBOARD_USER");
      
      // Log successful login
      dashboardLogger.logDashboardAccess("Dashboard Login Success", user.registrationId || registrationIdLogin.trim(), user.role || "DASHBOARD_USER");
      
      // Route to designation-specific dashboard
      const dashboardRoute = getDashboardRoute(user.designation);
      navigate(dashboardRoute);
    } catch (err) {
      setServerError(err.response?.data?.message || "Login failed. Please check your credentials.");
      dashboardLogger.logDashboardAccess("Dashboard Login Failed", registrationIdLogin.trim(), "GUEST");
    } finally {
      setLoading(false);
    }
  };

  // Function to determine dashboard route based on designation
  const getDashboardRoute = (designation) => {
    // Dashboard routing based on designation
    const designationRoutes = {
      "Director": "/empdashboard", // All access
      "HR Executive": "/empdashboard", // Employee Dashboard
      "factory_Manager": "/pandpdashboard", // Process and Inventory
      "Production_Manager": "/pandpdashboard", // Process Dashboard
      "quality_assurance_officer": "/pandpdashboard", // Process Dashboard
      "accountent": "/financedashboard", // Finance Dashboard
      "systemmanager": "/admindashboard", // System Admin Dashboard
      "Office Assistant": "/indashboard" // Inventory Dashboard
    };

    // Return the route for the designation, default to employee dashboard
    return designationRoutes[designation] || "/empdashboard";
  };

  const handleRegistrationChange = (e) => {
    const { name, value } = e.target;
    setRegistrationForm(prev => {
      const next = { ...prev, [name]: value };
      // validate this field live
      const message = validateRegistrationField(name, value, next);
      setRegistrationErrors(prevErrors => ({
        ...prevErrors,
        [name]: message
      }));
      // If password changes and confirmPassword exists, revalidate confirmPassword
      if (name === "password" && next.confirmPassword) {
        const confirmMsg = validateRegistrationField("confirmPassword", next.confirmPassword, next);
        setRegistrationErrors(prevErrors => ({ ...prevErrors, confirmPassword: confirmMsg }));
      }
      return next;
    });
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    setRegistrationSuccess("");
    
    if (!validateRegistration()) return;

    try {
      setLoading(true);
      
      // Register dashboard access with validation against employee database
      const registrationRes = await api.post("/api/dashboard-registration/register", {
        registrationId: registrationForm.regId.trim(),
        designation: registrationForm.designation,
        department: registrationForm.department,
        password: registrationForm.password
      });
      
      const { registration } = registrationRes.data;
      
      dashboardLogger.logDashboardAccess("Dashboard Registration Success", registration.registrationId, "DASHBOARD_USER");
      setRegistrationSuccess(`Dashboard access registered successfully! You can now sign in with your Registration ID: ${registration.registrationId}`);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed.";
      if (errorMessage.includes("Registration") || errorMessage.includes("registrationId")) {
        setRegistrationErrors(prev => ({ ...prev, regId: errorMessage }));
      } else if (errorMessage.includes("Department")) {
        setRegistrationErrors(prev => ({ ...prev, department: errorMessage }));
      } else if (errorMessage.includes("Designation")) {
        setRegistrationErrors(prev => ({ ...prev, designation: errorMessage }));
      } else {
        setRegistrationErrors(prev => ({ ...prev, general: errorMessage }));
      }
      return;
    } finally {
      setLoading(false);
    }
    
    // Reset registration form
    setRegistrationForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      regId: "",
      password: "",
      confirmPassword: "",
      designation: "",
      department: "",
      position: ""
    });
    
    // Switch back to login after 3 seconds
    setTimeout(() => {
      setShowRegistration(false);
      setRegistrationSuccess("");
    }, 3000);
  };

  return (
    <div className="inv-login-page">
      <div className={`inv-login-card ${showRegistration ? "inv-login-card--single" : ""}`} role="main" aria-labelledby="inv-heading">
        {!showRegistration && (
        <aside className="inv-side">
          <div className="inv-side-inner">
            <div className="inv-logo-large" aria-hidden="true">G</div>
            <h2>{showRegistration ? "Join our team" : "Welcome back"}</h2>
            <p className="inv-side-sub">
              {showRegistration 
                ? "Create your account to access the gemstone management system." 
                : "Sign in to manage gemstone inventory and stock movements."
              }
            </p>
          </div>
        </aside>
        )}

        <section className={`inv-main ${showRegistration ? "inv-main--reg" : ""}`}>
          <div className="inv-brand">
            <h1 id="inv-heading">{showRegistration ? "Create Account" : "Employee Login"}</h1>
            <p className="inv-sub">
              {showRegistration 
                ? "Register for access to the gemstone management system" 
                : "Login with your Registration ID and Password to access your department dashboard"
              }
            </p>
          </div>

          {!showRegistration ? (
            <form className="inv-form" onSubmit={handleSubmit} noValidate>
            <div className="inv-field inv-with-icon">
              <label htmlFor="registrationIdLogin">Registration ID</label>
              <div className="inv-input-wrap">
                <UserIcon className="inv-icon" aria-hidden="true" />
                <input
                  id="registrationIdLogin"
                  name="registrationIdLogin"
                  type="text"
                  value={registrationIdLogin}
                  onChange={(ev) => setRegistrationIdLogin(ev.target.value)}
                  placeholder="Enter your registration ID"
                  aria-invalid={errors.registrationIdLogin ? "true" : "false"}
                  aria-describedby={errors.registrationIdLogin ? "registrationIdLogin-error" : undefined}
                />
              </div>
              {errors.registrationIdLogin && <div id="registrationIdLogin-error" className="inv-error">{errors.registrationIdLogin}</div>}
            </div>

            <div className="inv-field inv-with-icon">
              <label htmlFor="password">Password</label>
              <div className="inv-input-wrap">
                <LockIcon className="inv-icon" aria-hidden="true" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(ev) => setPassword(ev.target.value)}
                  placeholder="Your password"
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                <button
                  type="button"
                  className="inv-show-btn"
                  onClick={() => setShowPassword(s => !s)}
                  aria-pressed={showPassword}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && <div id="password-error" className="inv-error">{errors.password}</div>}
            </div>

            {serverError && <div className="inv-server-error" role="alert">{serverError}</div>}

          <div className="inv-help" style={{marginTop: '12px', fontSize: '13px', color: '#666'}}>
            <strong>Dashboard Access by Designation:</strong><br/>
            • Director → All Access (Employee Dashboard)<br/>
            • HR Executive → Employee Dashboard<br/>
            • Factory Manager → Process & Inventory Dashboard<br/>
            • Production Manager → Process Dashboard<br/>
            • Quality Assurance Officer → Process Dashboard<br/>
            • Accountant → Finance Dashboard<br/>
            • System Manager → System Admin Dashboard<br/>
            • Office Assistant → Inventory Dashboard
          </div>

            <div className="inv-actions">
              <div className="inv-actions-left">
                <button className="inv-submit" type="submit" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </div>

              <div className="inv-actions-right">
                <button
                  type="button"
                  className="inv-link"
                  onClick={() => { setShowForgot(s => !s); setForgotMessage(""); setForgotRegId(""); }}
                  aria-expanded={showForgot}
                >
                  Forgot password?
                </button>
              </div>
            </div>

            {showForgot && (
              <div className="inv-forgot">
                <label htmlFor="forgotRegId">Reset password</label>
                <div className="inv-forgot-row">
                  <input id="forgotRegId" type="text" value={forgotRegId} onChange={e=>setForgotRegId(e.target.value)} className="inv-input" placeholder="Registration ID" />
                  <button
                    type="button"
                    className="inv-submit inv-submit-ghost"
                    disabled={forgotSending}
                    onClick={async ()=>{
                      setForgotMessage("");
                      if (!forgotRegId.trim()) { setForgotMessage("Please enter your Registration ID."); return; }
                      try {
                        setForgotSending(true);
                        const res = await api.post("/api/employees/forgot-password", { registrationId: forgotRegId.trim() });
                        setForgotMessage(res.data?.message || "If that Registration ID exists, a password reset link has been sent to the account's email.");
                      } catch (err) {
                        setForgotMessage(err.response?.data?.message || "Failed to send reset link");
                      } finally {
                        setForgotSending(false);
                      }
                    }}
                  >{forgotSending ? "Sending..." : "Send"}</button>
                </div>
                {forgotMessage && <div className="inv-help" style={{marginTop:8}}>{forgotMessage}</div>}
              </div>
            )}

          </form>
          ) : (
            <form className="inv-form" onSubmit={handleRegistrationSubmit} noValidate>
              {/* Personal Information */}
              <div className="inv-form-section">
                <h3 className="inv-section-title">Personal Information</h3>
                
                <div className="inv-field-row">
                  <div className="inv-field">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={registrationForm.firstName}
                      onChange={handleRegistrationChange}
                      placeholder="Enter your first name"
                      aria-invalid={registrationErrors.firstName ? "true" : "false"}
                    onBlur={handleRegistrationChange}
                    />
                    {registrationErrors.firstName && <div className="inv-error">{registrationErrors.firstName}</div>}
                  </div>
                  
                  <div className="inv-field">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={registrationForm.lastName}
                      onChange={handleRegistrationChange}
                      placeholder="Enter your last name"
                      aria-invalid={registrationErrors.lastName ? "true" : "false"}
                    onBlur={handleRegistrationChange}
                    />
                    {registrationErrors.lastName && <div className="inv-error">{registrationErrors.lastName}</div>}
                  </div>
                </div>

                <div className="inv-field-row">
                  <div className="inv-field">
                    <label htmlFor="email">Email Address</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={registrationForm.email}
                      onChange={handleRegistrationChange}
                      placeholder="Enter your email"
                      aria-invalid={registrationErrors.email ? "true" : "false"}
                    onBlur={handleRegistrationChange}
                    />
                    {registrationErrors.email && <div className="inv-error">{registrationErrors.email}</div>}
                  </div>
                  
                  <div className="inv-field">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={registrationForm.phone}
                      onChange={handleRegistrationChange}
                      placeholder="Enter your phone number"
                      aria-invalid={registrationErrors.phone ? "true" : "false"}
                    onBlur={handleRegistrationChange}
                    />
                    {registrationErrors.phone && <div className="inv-error">{registrationErrors.phone}</div>}
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className="inv-form-section">
                <h3 className="inv-section-title">Account Information</h3>
                
                <div className="inv-field">
                  <label htmlFor="regId">Registration ID</label>
                  <input
                    id="regId"
                    name="regId"
                    type="text"
                    value={registrationForm.regId}
                    onChange={handleRegistrationChange}
                    placeholder="Choose a unique registration ID"
                    aria-invalid={registrationErrors.regId ? "true" : "false"}
                  />
                  {registrationErrors.regId && <div className="inv-error">{registrationErrors.regId}</div>}
                </div>

                <div className="inv-field-row">
                  <div className="inv-field">
                    <label htmlFor="password">Password</label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={registrationForm.password}
                      onChange={handleRegistrationChange}
                      placeholder="Create a strong password"
                      aria-invalid={registrationErrors.password ? "true" : "false"}
                    onBlur={handleRegistrationChange}
                    />
                    {registrationErrors.password && <div className="inv-error">{registrationErrors.password}</div>}
                  </div>
                  
                  <div className="inv-field">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={registrationForm.confirmPassword}
                      onChange={handleRegistrationChange}
                      placeholder="Confirm your password"
                      aria-invalid={registrationErrors.confirmPassword ? "true" : "false"}
                    onBlur={handleRegistrationChange}
                    />
                    {registrationErrors.confirmPassword && <div className="inv-error">{registrationErrors.confirmPassword}</div>}
                  </div>
                </div>
              </div>

              {/* Designation and Department */}
              <div className="inv-form-section">
                <h3 className="inv-section-title">Designation & Department</h3>
                
                <div className="inv-field-row">
                  <div className="inv-field">
                    <label htmlFor="designation">Designation</label>
                    <select
                      id="designation"
                      name="designation"
                      value={registrationForm.designation}
                      onChange={handleRegistrationChange}
                      aria-invalid={registrationErrors.designation ? "true" : "false"}
                      onBlur={handleRegistrationChange}
                    >
                      <option value="">Select your designation</option>
                      {EMPLOYEE_DESIGNATIONS.map(designation => (
                        <option key={designation} value={designation}>
                          {designation}
                        </option>
                      ))}
                    </select>
                    {registrationErrors.designation && <div className="inv-error">{registrationErrors.designation}</div>}
                  </div>
                  
                  <div className="inv-field">
                    <label htmlFor="department">Department</label>
                    <select
                      id="department"
                      name="department"
                      value={registrationForm.department}
                      onChange={handleRegistrationChange}
                      aria-invalid={registrationErrors.department ? "true" : "false"}
                    onBlur={handleRegistrationChange}
                    >
                      <option value="">Select your department</option>
                      {DEPARTMENTS.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                    {registrationErrors.department && <div className="inv-error">{registrationErrors.department}</div>}
                  </div>
                </div>

                <div className="inv-field">
                  <label htmlFor="position">Position/Job Title</label>
                  <input
                    id="position"
                    name="position"
                    type="text"
                    value={registrationForm.position}
                    onChange={handleRegistrationChange}
                    placeholder="Enter your job title"
                    aria-invalid={registrationErrors.position ? "true" : "false"}
                  onBlur={handleRegistrationChange}
                  />
                  {registrationErrors.position && <div className="inv-error">{registrationErrors.position}</div>}
                </div>
              </div>

              {registrationErrors.general && (
                <div className="inv-error" role="alert">
                  {registrationErrors.general}
                </div>
              )}

              {registrationSuccess && (
                <div className="inv-success" role="alert">
                  {registrationSuccess}
                </div>
              )}

              <div className="inv-actions">
                <div className="inv-actions-left">
                  <button
                    className="inv-submit"
                    type="submit"
                    disabled={
                      loading ||
                      !registrationForm.firstName.trim() ||
                      !registrationForm.lastName.trim() ||
                      !registrationForm.email.trim() ||
                      !registrationForm.phone.trim() ||
                      !registrationForm.regId.trim() ||
                      !registrationForm.password ||
                      !registrationForm.confirmPassword ||
                      !registrationForm.designation ||
                      !registrationForm.department ||
                      !registrationForm.position.trim() ||
                      Object.values(registrationErrors).some(Boolean)
                    }
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Toggle between Login and Registration */}
          <div className="inv-toggle">
            {!showRegistration ? (
              <p>
                Don't have an account?{" "}
                <button
                  type="button"
                  className="inv-link"
                  onClick={() => {
                    setShowRegistration(true);
                    setShowForgot(false);
                    setRegistrationSuccess("");
                    setRegistrationErrors({});
                  }}
                >
                  Create Account
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  className="inv-link"
                  onClick={() => {
                    setShowRegistration(false);
                    setRegistrationSuccess("");
                    setRegistrationErrors({});
                    setRegistrationForm({
                      firstName: "",
                      lastName: "",
                      email: "",
                      phone: "",
                      regId: "",
                      password: "",
                      confirmPassword: "",
                      designation: "",
                      department: "",
                      position: ""
                    });
                  }}
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default LoginInventory;
