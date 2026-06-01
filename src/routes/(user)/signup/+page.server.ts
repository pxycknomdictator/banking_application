import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types";
import { signupSchema } from "$lib/validator/auth-validator";

export const load: PageServerLoad = async () => {
	const signup = await superValidate(zod4(signupSchema));
	return { signup };
};
