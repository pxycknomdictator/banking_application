<script lang="ts">
	import { resolve } from "$app/paths";
	import { emailSchema } from "$lib/validator/auth-validator";
	import { superForm } from "sveltekit-superforms";
	import { zod4Client } from "sveltekit-superforms/adapters";

	import Logo from "$components/Logo.svelte";
	import LockIcon from "$lib/assets/lock.svg";
	import Footer from "$components/Footer.svelte";

	let { data } = $props();

	// svelte-ignore state_referenced_locally
	const { form, errors, enhance } = superForm(data.form, {
		validators: zod4Client(emailSchema),
		resetForm: false
	});
</script>

<main class="flex min-h-screen flex-col">
	<header class="flex h-20 w-full items-center border border-outline px-16">
		<nav class="flex w-full items-center justify-between">
			<Logo />
			<div>
				<img src={LockIcon} alt="lock_icon" />
			</div>
		</nav>
	</header>
	<section class="flex flex-1">
		<form action="?/forget_password" method="post" use:enhance>
			<h1>Forgot Password</h1>
			<div>
				<label for="email">Email Address</label>
				<div>
					<input type="email" name="email" id="email" bind:value={$form.email} />
					{#if $errors.email}
						<small>{$errors.email}</small>
					{/if}
				</div>
			</div>

			<section>
				<div>
					<span>Already have an account? <a href={resolve("/login")}>Login</a></span>
				</div>
				<button type="submit">Send Reset Link</button>
			</section>
			<div>
				<span>Didn't get the email?</span>
				<button formaction="?/forget_password" type="submit">Resend Email</button>
			</div>
		</form>
	</section>
	<Footer linkTexts={["Privacy Policy", "Shariah Governance", "Support"]} />
</main>
