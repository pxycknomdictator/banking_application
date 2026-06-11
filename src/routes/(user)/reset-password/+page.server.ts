import { fail, message, superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import type { Actions, PageServerLoad } from "./$types";
import { resetPasswordSchema } from "$lib/validator/auth-validator";
import { auth } from "$lib/server/auth";
import { APIError } from "better-auth/api";
import { redirect } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { verifications } from "$lib/server/db/schema";
import { and, eq, gt } from "drizzle-orm";

export const load: PageServerLoad = async ({ locals, url }) => {
	if (locals.user && locals.user.emailVerified) {
		throw redirect(302, "/dashboard");
	}

	const token = url.searchParams.get("token");
	if (!token) throw redirect(302, "/forget-password");

	const validToken = await db.query.verifications.findFirst({
		where: and(
			eq(verifications.identifier, `reset-password:${token}`),
			gt(verifications.expiresAt, new Date())
		)
	});

	if (!validToken) throw redirect(302, "/forget-password");

	const form = await superValidate(zod4(resetPasswordSchema));
	return { form };
};

export const actions: Actions = {
	async reset_password({ request }) {
		const form = await superValidate(request, zod4(resetPasswordSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await auth.api.resetPassword({
				body: {
					newPassword: form.data.password,
					token: form.data.token
				},
				headers: request.headers
			});

			return message(form, "Password reset successful! You can now login.");
		} catch (error) {
			if (error instanceof APIError) {
				if (error.status === 429) {
					return message(form, "Too many attempts. Try again in 1 hour.", {
						status: 429
					});
				}
			}
			return message(form, "Invalid or expired reset link. Please request a new one.", {
				status: 400
			});
		}
	}
};
