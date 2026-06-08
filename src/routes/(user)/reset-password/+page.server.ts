import { fail, message, superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import type { Actions, PageServerLoad } from "./$types";
import { resetPasswordSchema } from "$lib/validator/auth-validator";
import { auth } from "$lib/server/auth";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user && locals.user.emailVerified) {
		throw redirect(302, "/dashboard");
	}

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
				}
			});

			return message(form, "Password reset successful! You can now login.");
		} catch (e) {
			console.error("Reset password error:", e);
			return message(form, "Invalid or expired reset link. Please request a new one.", {
				status: 400
			});
		}
	}
};
