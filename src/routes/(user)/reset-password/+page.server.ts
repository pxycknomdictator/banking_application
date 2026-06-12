import { fail, message, superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import type { Actions, PageServerLoad } from "./$types";
import { resetPasswordSchema } from "$lib/validator/auth-validator";
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
	async reset_password({ request, fetch }) {
		const form = await superValidate(request, zod4(resetPasswordSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const response = await fetch("/api/auth/reset-password", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-forwarded-for": request.headers.get("x-forwarded-for") ?? ""
			},
			body: JSON.stringify({
				newPassword: form.data.password,
				token: form.data.token
			})
		});

		if (response.status === 429) {
			const retryAfter = response.headers.get("X-Retry-After");
			return message(form, `Too many attempts. Try again in ${retryAfter ?? 3600} seconds.`, {
				status: 429
			});
		}

		if (!response.ok) {
			return message(form, "Invalid or expired reset link. Please request a new one.", {
				status: 400
			});
		}

		return message(form, "Password reset successful! You can now login.");
	}
};
