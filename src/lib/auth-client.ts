import { createAuthClient } from "better-auth/svelte";
import { adminClient, usernameClient, lastLoginMethodClient } from "better-auth/client/plugins";
import {
	ac,
	admin,
	branch_manager,
	compliance_officer,
	support_agent,
	customer
} from "$lib/permissions";

export const authClient = createAuthClient({
	plugins: [
		adminClient({
			ac,
			roles: { admin, branch_manager, compliance_officer, support_agent, customer }
		}),
		usernameClient(),
		lastLoginMethodClient()
	]
});
