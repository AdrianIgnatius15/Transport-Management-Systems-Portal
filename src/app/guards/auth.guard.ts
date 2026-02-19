import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthGuardData, createAuthGuard } from 'keycloak-angular';

/**
 * Comprehensive auth guard that handles:
 * - Authentication checks (must be logged in)
 * - Role-based access control (RBAC)
 * - Login page protection (redirect if already logged in)
 * 
 * Usage:
 * - For protected routes: canActivate: [authGuard], data: { role: 'customer' }
 * - For login page: canActivate: [authGuard], data: { requireNoAuth: true }
 * - For simple auth check: canActivate: [authGuard], data: { requireAuth: true }
 */

const checkAccess = async (
  route: ActivatedRouteSnapshot,
  _: RouterStateSnapshot,
  authData: AuthGuardData
): Promise<boolean | UrlTree> => {
  const router = inject(Router);
  const { authenticated, grantedRoles } = authData;

  // Case 1: Route requires NO authentication (e.g., login page)
  // Redirect logged-in users away from login
  if (route.data['requireNoAuth']) {
    if (authenticated) {
      return router.parseUrl('/orders');
    }
    return true;
  }

  // Case 2: Check if user is authenticated (required for all other routes)
  if (!authenticated) {
    return router.parseUrl('/login');
  }

  // Case 3: Check for required role (RBAC)
  const requiredRole = route.data['role'];
  if (requiredRole) {
    const hasRequiredRole = (role: string): boolean =>
      Object.values(grantedRoles.resourceRoles).some((roles) => roles.includes(role));

    if (!hasRequiredRole(requiredRole)) {
      return router.parseUrl('/forbidden');
    }
  }

  // All checks passed
  return true;
};

export const authGuard = createAuthGuard<CanActivateFn>(checkAccess);
