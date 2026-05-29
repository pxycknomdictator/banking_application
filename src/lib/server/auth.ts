import { env } from "$env/dynamic/private";
import { db } from "./db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { getRequestEvent } from "$app/server";
import { sendEmail } from "./email/resend";
import { admin, username, lastLoginMethod } from "better-auth/plugins";

export const auth = betterAuth({
	appName: "banking_application",
	baseURL: env.BETTER_AUTH_URL,
	secret: env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, { provider: "pg", usePlural: true, transaction: true }),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
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
	plugins: [admin(), username(), lastLoginMethod(), sveltekitCookies(getRequestEvent)]
});
