import { fail, message, superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import type { Actions, PageServerLoad } from "./$types";
import { signupSchema } from "$lib/validator/auth-validator";
import { auth } from "$lib/server/auth";
import { APIError } from "better-auth/api";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user && locals.user.emailVerified) {
		throw redirect(302, "/dashboard");
	}

	const signup = await superValidate(zod4(signupSchema));
	return { signup };
};

export const actions: Actions = {
	async signup({ request }) {
		const form = await superValidate(request, zod4(signupSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await auth.api.signUpEmail({
				body: {
					name: form.data.name,
					username: form.data.username,
					email: form.data.email,
					password: form.data.password,
					callbackURL: "/dashboard"
				},
				headers: request.headers
			});

			return message(
				form,
				"Account created! Please check your email to verify your account."
			);
		} catch (error) {
			if (error instanceof APIError) {
				if (error.body?.code === "USERNAME_IS_ALREADY_TAKEN") {
					return message(form, "username is already taken", { status: 400 });
				}

				if (error.body?.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") {
					return message(form, "email is already exists", { status: 400 });
				}
			}
		}
	}
};
