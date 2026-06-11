import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { auth } from "$lib/server/auth";

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

	return { maskedEmail: `${masked}@${domain}` };
};

export const actions: Actions = {
	async resend_email({ locals, request }) {
		const user = locals.user;

		if (!user) {
			redirect(302, "/login");
		}

		try {
			await auth.api.sendVerificationEmail({
				body: {
					email: user.email,
					callbackURL: "/verify-email"
				},
				headers: request.headers
			});
		} catch (e) {
			console.error("Resend verification error:", e);
		}
	}
};
