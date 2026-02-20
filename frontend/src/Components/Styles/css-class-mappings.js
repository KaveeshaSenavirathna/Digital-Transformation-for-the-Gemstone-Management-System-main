// CSS Class Mapping for Customer & Order System
// This script helps map old CSS classes to new namespaced classes

const classMappings = {
  // Container classes
  'order-container': 'co-order-container',
  'bg-decoration': 'co-bg-decoration',
  'blob': 'co-blob',
  'main-content': 'co-main-content',
  'order-hero': 'co-order-hero',
  'hero-left': 'co-hero-left',
  'hero-title': 'co-hero-title',
  'hero-subtitle': 'co-hero-subtitle',
  'hero-actions': 'co-hero-actions',
  
  // Button classes
  'btn': 'co-btn',
  'btn-primary': 'co-btn-primary',
  'btn-secondary': 'co-btn-secondary',
  
  // Dashboard classes
  'dashboard': 'co-dashboard',
  'dashboard-grid': 'co-dashboard-grid',
  'kpi-card': 'co-kpi-card',
  'kpi-header': 'co-kpi-header',
  'kpi-icon': 'co-kpi-icon',
  'kpi-label': 'co-kpi-label',
  'kpi-value': 'co-kpi-value',
  'kpi-change': 'co-kpi-change',
  
  // Action card classes
  'action-card': 'co-action-card',
  'action-icon': 'co-action-icon',
  'action-title': 'co-action-title',
  'action-description': 'co-action-description',
  'action-button': 'co-action-button',
  
  // Navigation classes
  'nav-buttons': 'co-nav-buttons',
  'nav-button': 'co-nav-button',
  
  // Header classes
  'header-section': 'co-header-section',
  'main-title': 'co-main-title',
  'subtitle': 'co-subtitle'
};

// Admin Dashboard class mappings
const adminClassMappings = {
  'admin-dashboard': 'ad-admin-dashboard',
  'bg-effects': 'ad-bg-effects',
  'floating-shape': 'ad-floating-shape',
  'main-content': 'ad-main-content',
  'header-section': 'ad-header-section',
  'main-title': 'ad-main-title',
  'subtitle': 'ad-subtitle',
  'nav-buttons': 'ad-nav-buttons',
  'nav-button': 'ad-nav-button',
  'dashboard-grid': 'ad-dashboard-grid',
  'kpi-card': 'ad-kpi-card',
  'kpi-header': 'ad-kpi-header',
  'kpi-icon': 'ad-kpi-icon',
  'kpi-label': 'ad-kpi-label',
  'kpi-value': 'ad-kpi-value',
  'kpi-change': 'ad-kpi-change',
  'action-card': 'ad-action-card',
  'action-icon': 'ad-action-icon',
  'action-title': 'ad-action-title',
  'action-description': 'ad-action-description',
  'action-button': 'ad-action-button'
};

console.log('CSS Class Mappings Created');
console.log('Customer Order Classes:', classMappings);
console.log('Admin Dashboard Classes:', adminClassMappings);
