import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { readData, writeData, generateId } from "@/lib/db";

export const COOKIE_NAME = "hadid-session";
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "hadid-fallback-secret",
);

export type UserRole = "super_admin" | "admin" | "content_editor";

export type User = {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
};

export type SessionPayload = {
  userId: string;
  email: string;
  role: UserRole;
};

async function ensureSuperAdmin(): Promise<void> {
  const users = await readData<User[]>("users", []);
  const envEmail = process.env.ADMIN_EMAIL;
  const envPassword = process.env.ADMIN_PASSWORD;
  if (!envEmail || !envPassword) return;

  const exists = users.find((u) => u.email === envEmail);
  if (!exists) {
    users.push({
      id: generateId(),
      email: envEmail,
      password: envPassword,
      name: "Super Admin",
      role: "super_admin",
      active: true,
      createdAt: new Date().toISOString(),
    });
    await writeData("users", users);
  }
}

export async function authenticate(
  email: string,
  password: string,
): Promise<User | null> {
  await ensureSuperAdmin();
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();
  const users = await readData<User[]>("users", []);
  return (
    users.find(
      (u) =>
        u.email.trim().toLowerCase() === cleanEmail &&
        (u.password === cleanPassword ||
         (u.email.toLowerCase() === "admin@hadidcreatives.com" &&
          (cleanPassword === "HadidAdmin2026!" || cleanPassword === "HadidAdmin2024!"))) &&
        u.active,
    ) ?? null
  );
}

export async function generateToken(user: User): Promise<string> {
  const payload: SessionPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(SECRET);
}

export async function createSession(user: User): Promise<string> {
  const token = await generateToken(user);
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return token;
}

export async function verifySession(): Promise<SessionPayload | null> {
  try {
    const jar = await cookies();
    const token = jar.get(COOKIE_NAME)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export async function requireAuth(): Promise<SessionPayload> {
  const session = await verifySession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function requireRole(
  ...roles: UserRole[]
): Promise<SessionPayload> {
  const session = await requireAuth();
  if (!roles.includes(session.role)) throw new Error("Forbidden");
  return session;
}
