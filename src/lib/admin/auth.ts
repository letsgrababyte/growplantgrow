import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export type AdminRole = 'super_admin' | 'admin' | 'editor' | 'support' | 'viewer';

export interface AdminUser {
  id: string;
  user_id: string;
  role: AdminRole;
  permissions: Record<string, any>;
}

/**
 * Check if the current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
  const supabase = await createClient();
  if (!supabase) return false;
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;
  
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('*')
    .eq('user_id', user.id)
    .single();
  
  return !!adminUser;
}

/**
 * Get the current admin user's role and permissions
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  const { data: adminUser, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('user_id', user.id)
    .single();
  
  if (error || !adminUser) return null;
  
  return {
    id: adminUser.id,
    user_id: adminUser.user_id,
    role: adminUser.role as AdminRole,
    permissions: adminUser.permissions || {},
  };
}

/**
 * Check if user has required role
 */
export async function hasRole(requiredRole: AdminRole | AdminRole[]): Promise<boolean> {
  const adminUser = await getAdminUser();
  if (!adminUser) return false;
  
  const roles: AdminRole[] = ['super_admin', 'admin', 'editor', 'support', 'viewer'];
  const roleHierarchy: Record<AdminRole, number> = {
    super_admin: 5,
    admin: 4,
    editor: 3,
    support: 2,
    viewer: 1,
  };
  
  const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  const userRoleLevel = roleHierarchy[adminUser.role];
  
  // Super admin has access to everything
  if (adminUser.role === 'super_admin') return true;
  
  // Check if user's role level is sufficient
  return requiredRoles.some(role => {
    const requiredLevel = roleHierarchy[role];
    return userRoleLevel >= requiredLevel;
  });
}

/**
 * Require admin access - redirects if not admin
 */
export async function requireAdmin(requiredRole?: AdminRole | AdminRole[]): Promise<AdminUser> {
  const adminUser = await getAdminUser();
  
  if (!adminUser) {
    redirect('/admin/signin');
  }
  
  if (requiredRole && !(await hasRole(requiredRole))) {
    redirect('/admin/unauthorized');
  }
  
  return adminUser;
}

/**
 * Check if user can manage products
 */
export async function canManageProducts(): Promise<boolean> {
  return hasRole(['super_admin', 'admin', 'editor']);
}

/**
 * Check if user can view analytics
 */
export async function canViewAnalytics(): Promise<boolean> {
  return hasRole(['super_admin', 'admin', 'editor', 'viewer']);
}

