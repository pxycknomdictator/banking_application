import { createAuthClient } from "better-auth/svelte";
import { adminClient, usernameClient, lastLoginMethodClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
	plugins: [adminClient(), usernameClient(), lastLoginMethodClient()]
});
