import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { emailSchema } from "$lib/validator/auth-validator";
import { superValidate, message } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;

	if (!user) throw redirect(302, "/login");
	if (user.emailVerified) throw redirect(302, "/dashboard");

	const [local, domain] = user.email.split("@");
	const masked = local.slice(0, 2) + "*".repeat(local.length - 2);

	const form = await superValidate(zod4(emailSchema));
	return { maskedEmail: `${masked}@${domain}`, form, email: user.email };
};

export const actions: Actions = {
	async resend_email({ locals, request, fetch }) {
		const form = await superValidate(request, zod4(emailSchema));
		const user = locals.user;

		if (!user) throw redirect(302, "/login");

		const response = await fetch("/api/auth/send-verification-email", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-forwarded-for": request.headers.get("x-forwarded-for") ?? ""
			},
			body: JSON.stringify({
				email: user.email || form.data.email,
				callbackURL: "/verify-email"
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
	}
};
