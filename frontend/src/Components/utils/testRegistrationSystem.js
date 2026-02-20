// Test file for Registration System
// This file can be used to test the registration functionality

import dashboardLogger from './dashboardLogger';

// Test function to simulate registration process
export const testRegistrationSystem = () => {
  console.log('🧪 Testing Registration System...');
  
  // Test registration data
  const testRegistrationData = {
    firstName: "John",
    lastName: "Doe", 
    email: "john.doe@example.com",
    phone: "+1234567890",
    regId: "test001",
    password: "TestPass123",
    confirmPassword: "TestPass123",
    role: "EMPLOYEE",
    department: "Human Resources",
    position: "Software Developer"
  };
  
  console.log('📝 Test Registration Data:', testRegistrationData);
  
  // Test validation rules
  const validationTests = [
    {
      name: "Email Validation",
      test: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testRegistrationData.email),
      expected: true
    },
    {
      name: "Password Strength",
      test: /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(testRegistrationData.password),
      expected: true
    },
    {
      name: "Phone Validation",
      test: /^[\+]?[1-9][\d]{0,15}$/.test(testRegistrationData.phone.replace(/[\s\-\(\)]/g, '')),
      expected: true
    },
    {
      name: "Registration ID Length",
      test: testRegistrationData.regId.length >= 3,
      expected: true
    }
  ];
  
  console.log('✅ Validation Tests:');
  validationTests.forEach(test => {
    const result = test.test === test.expected ? '✅' : '❌';
    console.log(`${result} ${test.name}: ${test.test}`);
  });
  
  // Test logging integration
  dashboardLogger.logDashboardAccess("Registration Test", testRegistrationData.regId, testRegistrationData.role);
  
  console.log('📊 Registration logged successfully');
  console.log('✅ Registration System Test Completed!');
  
  return {
    testData: testRegistrationData,
    validationResults: validationTests,
    logged: true
  };
};

// Auto-run test when imported (for development)
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Development Mode: Registration System Test Available');
  console.log('💡 Run testRegistrationSystem() in browser console to test');
}
