import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { auth } from "$lib/server/auth";
import { emailSchema } from "$lib/validator/auth-validator";
import { APIError } from "better-auth/api";
import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;

	if (!user) {
		redirect(302, "/login");
	}

	if (user.emailVerified) {
		redirect(302, "/dashboard");
	}

	const [local, domain] = user.email.split("@");
	const masked = local.slice(0, 2) + "*".repeat(local.length - 2);

	const form = await superValidate(zod4(emailSchema));
	return { maskedEmail: `${masked}@${domain}`, form, email: user.email };
};

export const actions: Actions = {
	async resend_email({ locals, request }) {
		const form = await superValidate(request, zod4(emailSchema));
		const user = locals.user;

		if (!user) {
			redirect(302, "/login");
		}

		try {
			await auth.api.sendVerificationEmail({
				body: {
					email: user.email || form.data.email,
					callbackURL: "/verify-email"
				},
				headers: request.headers
			});
		} catch (e) {
			console.error("Resend verification error:", e);
		}
	}
};
