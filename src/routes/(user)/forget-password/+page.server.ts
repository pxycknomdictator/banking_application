import { fail, message, superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import type { Actions, PageServerLoad } from "./$types";
import { emailSchema } from "$lib/validator/auth-validator";
import { db } from "$lib/server/db";
import { users } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user && locals.user.emailVerified) {
		throw redirect(302, "/dashboard");
	}

	const form = await superValidate(zod4(emailSchema));
	return { form };
};

export const actions: Actions = {
	async forget_password({ request, fetch }) {
		const form = await superValidate(request, zod4(emailSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const [isEmailExists] = await db
			.select({ id: users.id })
			.from(users)
			.where(eq(users.email, form.data.email));

		if (!isEmailExists) {
			return message(
				form,
				"If this email is registered, you will receive a password reset link shortly."
			);
		}

		const response = await fetch("/api/auth/request-password-reset", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-forwarded-for": request.headers.get("x-forwarded-for") ?? ""
			},
			body: JSON.stringify({
				email: form.data.email,
				redirectTo: "http://localhost:5173/reset-password"
			})
		});

		if (response.status === 429) {
			const retryAfter = response.headers.get("X-Retry-After");
			return message(form, `Too many attempts. Try again in ${retryAfter ?? 3600} seconds.`, {
				status: 429
			});
		}

		if (!response.ok) {
			return message(form, "Failed to send email. Please try again later.", { status: 500 });
		}

		return message(
			form,
			"Password reset link has been sent to your email. Please check your inbox."
		);
	}
};
