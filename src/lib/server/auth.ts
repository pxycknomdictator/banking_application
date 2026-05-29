import { env } from "$env/dynamic/private";
import { db } from "./db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { getRequestEvent } from "$app/server";
import { admin, username, lastLoginMethod } from "better-auth/plugins";

export const auth = betterAuth({
	appName: "banking_application",
	baseURL: env.BETTER_AUTH_URL,
	secret: env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, { provider: "pg", usePlural: true, transaction: true }),
	emailAndPassword: { enabled: true, requireEmailVerification: true },
	plugins: [admin(), username(), lastLoginMethod(), sveltekitCookies(getRequestEvent)]
});
