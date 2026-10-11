export const ROLES = Object.freeze({
  CUSTOMER: 'customer',
  ADMIN: 'admin',
  OPERATIONS: 'operations',
  FINANCE: 'finance',
});

export const PERMISSIONS = Object.freeze({
  CUSTOMER_PROFILE_READ: 'customer:profile:read',
  CUSTOMER_BOOKINGS_READ: 'customer:bookings:read',
  CUSTOMER_BOOKING_CREATE: 'customer:booking:create',
  ADMIN_DASHBOARD_READ: 'admin:dashboard:read',
  FLEET_VEHICLES_MANAGE: 'fleet:vehicles:manage',
  FLEET_DRIVERS_MANAGE: 'fleet:drivers:manage',
  FLEET_ROUTES_MANAGE: 'fleet:routes:manage',
  FLEET_MAINTENANCE_MANAGE: 'fleet:maintenance:manage',
  OPERATIONS_PASSENGERS_READ: 'operations:passengers:read',
  OPERATIONS_TRIPS_MANAGE: 'operations:trips:manage',
  OPERATIONS_BOOKINGS_MANAGE: 'operations:bookings:manage',
  FINANCE_PAYMENTS_MANAGE: 'finance:payments:manage',
  SUPPORT_FEEDBACK_MANAGE: 'support:feedback:manage',
  REPORTS_READ: 'reports:read',
});

const rolePermissions = {
  [ROLES.CUSTOMER]: [
    PERMISSIONS.CUSTOMER_PROFILE_READ,
    PERMISSIONS.CUSTOMER_BOOKINGS_READ,
    PERMISSIONS.CUSTOMER_BOOKING_CREATE,
  ],
  [ROLES.ADMIN]: Object.values(PERMISSIONS).filter((permission) => !permission.startsWith('customer:')),
  [ROLES.OPERATIONS]: [
    PERMISSIONS.ADMIN_DASHBOARD_READ,
    PERMISSIONS.FLEET_VEHICLES_MANAGE,
    PERMISSIONS.FLEET_DRIVERS_MANAGE,
    PERMISSIONS.FLEET_ROUTES_MANAGE,
    PERMISSIONS.FLEET_MAINTENANCE_MANAGE,
    PERMISSIONS.OPERATIONS_PASSENGERS_READ,
    PERMISSIONS.OPERATIONS_TRIPS_MANAGE,
    PERMISSIONS.OPERATIONS_BOOKINGS_MANAGE,
  ],
  [ROLES.FINANCE]: [
    PERMISSIONS.ADMIN_DASHBOARD_READ,
    PERMISSIONS.FINANCE_PAYMENTS_MANAGE,
    PERMISSIONS.REPORTS_READ,
  ],
};

export function hasRole(user, role) {
  return Array.isArray(user?.roles) && user.roles.includes(role);
}

export function hasPermission(user, permission) {
  if (!user || !permission) return false;

  const assignedPermissions = Array.isArray(user.permissions) ? user.permissions : [];
  if (assignedPermissions.includes(permission)) return true;

  return (Array.isArray(user.roles) ? user.roles : []).some((role) => (
    rolePermissions[role]?.includes(permission)
  ));
}

export function getCustomerReturnLocation(from) {
  const customerPages = new Set(['/profile', '/my-bookings', '/payment', '/booking-success']);
  if (!from || !customerPages.has(from.pathname)) {
    return { to: '/profile', state: undefined };
  }

  return {
    to: `${from.pathname}${from.search || ''}${from.hash || ''}`,
    state: from.state,
  };
}

// The current project has demo-only browser authentication. Replace this adapter
// with the server's /auth/me response when a real authentication API is available.
export function getCurrentAdminDemoUser() {
  const authenticated = (
    sessionStorage.getItem('smartmove_admin_demo') === 'true' ||
    localStorage.getItem('smartmove_admin_demo') === 'true'
  );

  return authenticated
    ? { id: 'demo-admin', fullName: 'Admin', roles: [ROLES.ADMIN] }
    : null;
}
