<script lang="ts">
	interface Props {
		linkTexts: Array<string>;
	}

	let { linkTexts }: Props = $props();
</script>

<footer class="flex h-20 w-full items-center border border-outline px-6 md:px-16">
	<div
		class="flex w-full flex-col justify-center gap-y-1 sm:flex-row sm:justify-between sm:gap-y-0"
	>
		<div>
			<h6 class="text-[13px] sm:text-[14px]">© 2026 Banking Application</h6>
		</div>
		<nav class="flex list-none items-center gap-x-8 sm:gap-x-8">
			{#each linkTexts as text (text)}
				<li class="text-[13px] sm:text-[14px]">{text}</li>
			{/each}
		</nav>
	</div>
</footer>
