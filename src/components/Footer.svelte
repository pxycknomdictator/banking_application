<script lang="ts">
	interface Props {
		linkTexts: Array<string>;
	}

	let { linkTexts }: Props = $props();
</script>

<footer class="flex h-20 w-full items-center border border-outline px-16">
	<div class="flex w-full items-center justify-between">
		<div>
			<h6>© 2026 Banking Application. All rights reserved.</h6>
		</div>
		<nav class="flex list-none items-center gap-x-8">
			{#each linkTexts as text (text)}
				<li>{text}</li>
			{/each}
		</nav>
	</div>
</footer>
