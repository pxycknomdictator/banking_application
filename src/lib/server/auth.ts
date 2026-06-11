import { env } from "$env/dynamic/private";
import { db } from "./db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { getRequestEvent } from "$app/server";
import { sendEmail } from "./email/resend";
import { generateUniqueUsername } from "./utils";
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
	rateLimit: {
		enabled: true,
		window: 60,
		max: 20,
		customRules: {
			"/sign-up/email": { window: 60 * 60, max: 5 },
			"/sign-in/email": { window: 60, max: 5 },
			"/sign-in/social": { window: 60, max: 10 },
			"/send-verification-email": { window: 60 * 60, max: 3 },
			"/request-password-reset": { window: 60 * 60, max: 3 },
			"/reset-password": { window: 60 * 60, max: 3 }
		}
	},
	account: {
		accountLinking: {
			enabled: true,
			trustedProviders: ["email-password", "google", "github", "microsoft"]
		}
	},
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
		resetPasswordTokenExpiresIn: 900,
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
		autoSignInAfterVerification: true,
		sendVerificationEmail: async ({ user, url }) => {
			void sendEmail({
				receiver: user.email,
				subject: "Verify your email address",
				text: `Hey ${user.name} Click the link to verify your email: ${url}`
			});
		}
	},
	socialProviders: {
		github: {
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET,
			mapProfileToUser: async (profile) => ({
				username: await generateUniqueUsername(profile.login)
			})
		},
		google: {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
			mapProfileToUser: async (profile) => ({
				username: await generateUniqueUsername(profile.given_name ?? profile.name)
			})
		},
		microsoft: {
			clientId: env.MICROSOFT_CLIENT_ID,
			clientSecret: env.MICROSOFT_CLIENT_SECRET,
			tenantId: env.MICROSOFT_TENANT_ID,
			mapProfileToUser: async (profile) => ({
				username: await generateUniqueUsername(
					profile.preferred_username?.split("@")[0] ?? profile.name
				),
				emailVerified: true
			})
		}
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
