import { fail, message, superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import type { Actions, PageServerLoad } from "./$types";
import { signupSchema } from "$lib/validator/auth-validator";
import { redirect } from "@sveltejs/kit";
import { getForwardHeaders } from "$lib/server/utils";

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user && locals.user.emailVerified) {
		throw redirect(302, "/dashboard");
	}

	const signup = await superValidate(zod4(signupSchema));
	return { signup };
};

export const actions: Actions = {
	async signup({ request, fetch }) {
		const form = await superValidate(request, zod4(signupSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const response = await fetch("/api/auth/sign-up/email", {
			method: "POST",
			headers: getForwardHeaders(request),
			body: JSON.stringify({
				name: form.data.name,
				username: form.data.username,
				email: form.data.email,
				password: form.data.password,
				callbackURL: "/dashboard"
			})
		});

		if (response.status === 429) {
			const retryAfter = response.headers.get("X-Retry-After");
			return message(form, `Too many attempts. Try again in ${retryAfter ?? 3600} seconds.`, {
				status: 429
			});
		}

		if (!response.ok) {
			const data = await response.json();
			if (data?.code === "USERNAME_IS_ALREADY_TAKEN") {
				return message(form, "Username is already taken.", { status: 400 });
			}
			if (data?.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") {
				return message(form, "Email already exists.", { status: 400 });
			}
			return message(form, "Something went wrong. Please try again.", { status: 500 });
		}

		return message(form, "Account created! Please check your email to verify your account.");
	}
};
