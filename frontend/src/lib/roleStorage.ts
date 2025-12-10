export type Role = "student" | "mentor" | "admin";

const ROLES_KEY = "userRoles";

const readRoles = (): Record<string, Role> => {
  try {
    const raw = localStorage.getItem(ROLES_KEY);
    return raw ? (JSON.parse(raw) as Record<string, Role>) : {};
  } catch {
    return {};
  }
};

const writeRoles = (roles: Record<string, Role>) => {
  localStorage.setItem(ROLES_KEY, JSON.stringify(roles));
};

export const getRoleForEmail = (email?: string | null): Role | null => {
  if (!email) return null;
  const roles = readRoles();
  return roles[email] ?? null;
};

export const setRoleForEmail = (email: string | null | undefined, role: Role) => {
  if (!email) return;
  const roles = readRoles();
  roles[email] = role;
  writeRoles(roles);
};

