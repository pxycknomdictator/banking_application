import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types";
import { loginSchema } from "$lib/validator/auth-validator";

export const load: PageServerLoad = async () => {
	const login = await superValidate(zod4(loginSchema));
	return { login };
};
