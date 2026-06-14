<script lang="ts">
	import { page } from "$app/state";
	import { resolve } from "$app/paths";
	import { resetPasswordSchema } from "$lib/validator/auth-validator";
	import { superForm } from "sveltekit-superforms";
	import { zod4Client } from "sveltekit-superforms/adapters";
	import { goto } from "$app/navigation";

	import Logo from "$components/Logo.svelte";
	import LockIcon from "$lib/assets/lock.svg";
	import Footer from "$components/Footer.svelte";

	let { data } = $props();
	const token = page.url.searchParams.get("token");

	// svelte-ignore state_referenced_locally
	const { form, errors, enhance } = superForm(data.form, {
		validators: zod4Client(resetPasswordSchema),
		async onResult({ result }) {
			if (result.type === "success") {
				await goto(resolve("/login"), { replaceState: true });
			}
		}
	});
</script>

<main class="flex min-h-screen flex-col">
	<header class="flex h-20 w-full items-center border border-outline px-6 md:px-16">
		<nav class="flex w-full items-center justify-between">
			<Logo />
			<div>
				<img src={LockIcon} alt="lock_icon" />
			</div>
		</nav>
	</header>
	<section class="flex flex-1">
		<form action="?/reset_password" method="post" use:enhance>
			<h1>Reset Your Password</h1>
			<div>
				<input type="text" value={token} hidden name="token" id="token" />
			</div>

			<div>
				<label for="password">New Password</label>
				<div>
					<input
						type="password"
						name="password"
						id="password"
						bind:value={$form.password}
					/>
					{#if $errors.password}
						<small>{$errors.password}</small>
					{/if}
				</div>
			</div>

			<div>
				<label for="password_confirm">Confirm New Password</label>
				<div>
					<input
						type="password"
						name="password_confirm"
						id="password_confirm"
						bind:value={$form.password_confirm}
					/>
					{#if $errors.password_confirm}
						<small>{$errors.password_confirm}</small>
					{/if}
				</div>
			</div>

			<section>
				<a href={resolve("/login")}>Back to Login</a>
				<button type="submit">Update Password</button>
			</section>
		</form>
	</section>
	<Footer linkTexts={["Privacy", "Security", "Support"]} />
</main>
