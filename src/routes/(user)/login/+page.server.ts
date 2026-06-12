import { fail, message, superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import type { PageServerLoad, Actions } from "./$types";
import { loginSchema } from "$lib/validator/auth-validator";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user && locals.user.emailVerified) {
		throw redirect(302, "/dashboard");
	}

	const login = await superValidate(zod4(loginSchema));
	return { login };
};

export const actions: Actions = {
	async login({ request, fetch }) {
		const form = await superValidate(request, zod4(loginSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const response = await fetch("/api/auth/sign-in/email", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-forwarded-for": request.headers.get("x-forwarded-for") ?? ""
			},
			body: JSON.stringify({
				email: form.data.email,
				password: form.data.password,
				rememberMe: form.data.rememberMe
			})
		});

		if (response.status === 429) {
			const retryAfter = response.headers.get("X-Retry-After");
			return message(form, `Too many attempts. Try again in ${retryAfter ?? 60} seconds.`, {
				status: 429
			});
		}

		if (!response.ok) {
			const data = await response.json();
			if (data?.code === "INVALID_EMAIL_OR_PASSWORD") {
				return message(form, "Invalid email or password.", { status: 400 });
			}
			return message(form, "Something went wrong. Please try again.", { status: 500 });
		}

		return message(form, "Login successful! Welcome back.");
	}
};
