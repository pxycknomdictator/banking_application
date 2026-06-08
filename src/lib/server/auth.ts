import { env } from "$env/dynamic/private";
import { db } from "./db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { getRequestEvent } from "$app/server";
import { sendEmail } from "./email/resend";
import { admin as adminPlugin, username, lastLoginMethod } from "better-auth/plugins";
import {
	ac,
	admin,
	branch_manager,
	compliance_officer,
	support_agent,
	customer
} from "$lib/permissions";

export const auth = betterAuth({
	appName: "banking_application",
	baseURL: env.BETTER_AUTH_URL,
	secret: env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, { provider: "pg", usePlural: true, transaction: true }),
	account: {
		accountLinking: {
			enabled: true,
			trustedProviders: ["email-password", "google", "github", "microsoft"]
		}
	},
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
		sendResetPassword: async ({ user, url }) => {
			void sendEmail({
				receiver: user.email,
				subject: "Reset your password",
				text: `Click the link to reset your password: ${url}`
			});
		}
	},
	emailVerification: {
		sendOnSignUp: true,
		sendVerificationEmail: async ({ user, url }) => {
			void sendEmail({
				receiver: user.email,
				subject: "Verify your email address",
				text: `Hey ${user.name} Click the link to verify your email: ${url}`
			});
		}
	},
	socialProviders: {
		github: { clientId: env.GITHUB_CLIENT_ID, clientSecret: env.GITHUB_CLIENT_SECRET },
		google: { clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET },
		microsoft: { clientId: env.MICROSOFT_CLIENT_ID, clientSecret: env.MICROSOFT_CLIENT_SECRET }
	},
	plugins: [
		adminPlugin({
			ac,
			roles: { admin, branch_manager, compliance_officer, support_agent, customer },
			adminRoles: ["admin", "branch_manager"],
			defaultRole: "customer"
		}),
		username(),
		lastLoginMethod(),
		sveltekitCookies(getRequestEvent)
	]
});

export type User = typeof auth.$Infer.Session.user;
export type Session = typeof auth.$Infer.Session.session;
