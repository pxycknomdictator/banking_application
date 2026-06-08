import { fail, message, superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import type { PageServerLoad, Actions } from "./$types";
import { loginSchema } from "$lib/validator/auth-validator";
import { auth } from "$lib/server/auth";
import { APIError } from "better-auth/api";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async () => {
	const login = await superValidate(zod4(loginSchema));
	return { login };
};

export const actions: Actions = {
	async login({ request }) {
		const form = await superValidate(request, zod4(loginSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await auth.api.signInEmail({
				body: {
					email: form.data.email,
					password: form.data.password
				},
				headers: request.headers
			});
		} catch (error) {
			if (error instanceof APIError) {
				if (error.body?.code === "INVALID_EMAIL_OR_PASSWORD") {
					return message(form, "invalid email or password", { status: 400 });
				}
			}
		}

		throw redirect(302, "/dashboard");
	}
};
