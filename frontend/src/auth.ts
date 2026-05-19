import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import type { DefaultSession } from "next-auth";

type AppRole = "admin" | "member" | "obog" | "pre_member" | "none";

function parseCsvEnv(key: string, fallbackKey?: string): string[] {
  const value = process.env[key] || (fallbackKey ? process.env[fallbackKey] : "") || "";
  return value
    .split(",")
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);
}

const adminEmails = parseCsvEnv("ADMIN_EMAILS");
const memberEmails = parseCsvEnv("MEMBER_EMAILS");
const obogEmails = parseCsvEnv("OBOG_EMAILS");
const preMemberEmails = parseCsvEnv("PRE_MEMBER_EMAILS");
const allowedEmails = parseCsvEnv("ALLOWED_EMAILS", "NEXT_PUBLIC_ALLOWED_EMAILS");
const joinAllowedDomain = "aoyama.ac.jp";

function resolveRoleByEmail(email?: string | null): AppRole {
  const normalized = email?.trim().toLowerCase();
  if (!normalized) return "none";
  if (adminEmails.includes(normalized)) return "admin";
  if (memberEmails.includes(normalized)) return "member";
  if (obogEmails.includes(normalized)) return "obog";
  if (preMemberEmails.includes(normalized)) return "pre_member";
  return "none";
}

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      role?: AppRole;
    } & DefaultSession["user"];
  }
}

const providers: any[] = [];

const googleClientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (googleClientId && googleClientSecret) {
  providers.push(
    Google({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    })
  );
}

// Always include at least one provider
if (providers.length === 0) {
  providers.push(
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        return null;
      },
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  trustHost: true,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user }) {
      const email = user.email?.trim().toLowerCase();
      if (!email) return false;

      // allowlist が空の場合は全員許可（開発環境等）
      if (allowedEmails.length === 0) return email.endsWith(`@${joinAllowedDomain}`);

      return allowedEmails.includes(email) || email.endsWith(`@${joinAllowedDomain}`);
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      try {
        const parsed = new URL(url);
        if (parsed.origin === baseUrl) return url;
      } catch {
        // ignore and fallback to base URL
      }
      return baseUrl;
    },
    async jwt({ token, user }) {
      const mutableToken = token as typeof token & {
        id?: string;
        role?: AppRole;
        email?: string | null;
      };

      if (user) {
        mutableToken.id = user.id;
        mutableToken.email = user.email;
        mutableToken.role = resolveRoleByEmail(user.email);
      }
      return mutableToken;
    },
    async session({ session, token }) {
      const typedToken = token as typeof token & {
        id?: string;
        role?: AppRole;
        email?: string | null;
      };

      if (session.user) {
        session.user.id = typedToken.id;
        session.user.email = typedToken.email ?? null;
        session.user.role = typedToken.role ?? "none";
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});
