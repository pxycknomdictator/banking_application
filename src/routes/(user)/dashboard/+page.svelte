<script lang="ts">
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";
	import { authClient } from "$lib/auth-client";

	let { data } = $props();

	async function logout() {
		const { error } = await authClient.signOut();

		if (error) {
			console.error(error.message || "unexpected error");
			return;
		}

		await goto(resolve("/login"), { replaceState: true, invalidateAll: true });
	}
</script>

<main>
	{#if data}
		<h1>Welcome {data.name}</h1>
		<span>Session Id: {data.session}</span>
		<div>
			<button type="button" onclick={logout}>logout</button>
		</div>
	{/if}
</main>
