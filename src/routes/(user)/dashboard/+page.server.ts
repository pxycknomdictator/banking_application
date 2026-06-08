import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;

	if (!user) {
		throw redirect(302, "/login");
	}

	if (!user.emailVerified) {
		throw redirect(302, "/verify-email");
	}

	return {
		name: user.name,
		session: locals.session.token
	};
};
