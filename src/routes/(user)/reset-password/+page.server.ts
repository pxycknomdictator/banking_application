import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types";
import { passwordSchema } from "$lib/validator/auth-validator";

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod4(passwordSchema));
	return { form };
};
