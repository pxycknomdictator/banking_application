<script lang="ts">
	import { resolve } from "$app/paths";
	import { emailSchema } from "$lib/validator/auth-validator";
	import { superForm } from "sveltekit-superforms";
	import { zod4Client } from "sveltekit-superforms/adapters";

	let { data } = $props();

	// svelte-ignore state_referenced_locally
	const { form, errors, enhance } = superForm(data.form, {
		validators: zod4Client(emailSchema)
	});
</script>

<main>
	<section>
		<h1>Forgot Password</h1>
		<form action="?/forget_password" method="post" use:enhance>
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
				<button type="button">Resend Email</button>
			</div>
		</form>
	</section>
</main>
