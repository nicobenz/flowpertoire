<script lang="ts">
	import type { Snippet } from 'svelte';
	import { AspectRatio } from '$lib/components/ui/aspect-ratio/index.js';
	import * as PointyCard from '$lib/components/ui/pointy-card';

	/** Portrait 4:5, Instagram feed (1080×1350). */
	const INSTAGRAM_RATIO = 1080 / 1350;

	interface Props {
		exportReady?: (el: HTMLDivElement) => void;
		children?: Snippet;
	}

	let { exportReady, children }: Props = $props();

	let cardEl = $state<HTMLDivElement | null>(null);

	$effect(() => {
		if (cardEl && exportReady) {
			exportReady(cardEl);
		}
	});
</script>

<div class="mx-auto w-full max-w-[min(28rem,75vw)] py-6">
	<AspectRatio
		bind:ref={cardEl}
		ratio={INSTAGRAM_RATIO}
		class="w-full bg-background shadow-xl"
		role="img"
		aria-label="Instagram image preview"
	>
		<PointyCard.Root class="h-full w-full overflow-hidden rounded-none border-0 shadow-none">
			<PointyCard.Content class="flex h-full flex-col px-12 pt-6">
				{#if children}
					{@render children()}
				{:else}
					<div class="box-border flex h-full w-full flex-col gap-10">
						<header class="shrink-0">
							<h1 class="m-0 text-[36px] leading-tight font-bold tracking-tight text-foreground">
								Emmy Example
							</h1>
							<p class="text-xl font-medium text-muted-foreground">Skill Progress</p>
						</header>
						<div class="flex shrink-0 gap-6">
							<div class="flex flex-1 flex-col gap-1 rounded-xl border border-border bg-muted p-6">
								<span class="text-3xl leading-none font-bold text-foreground">12</span>
								<span class="text-sm font-medium text-muted-foreground">Practiced</span>
							</div>
							<div class="flex flex-1 flex-col gap-1 rounded-xl border border-border bg-muted p-6">
								<span class="text-3xl leading-none font-bold text-foreground">5</span>
								<span class="text-sm font-medium text-muted-foreground">Started</span>
							</div>
							<div class="flex flex-1 flex-col gap-1 rounded-xl border border-border bg-muted p-6">
								<span class="text-3xl leading-none font-bold text-foreground">4</span>
								<span class="text-sm font-medium text-muted-foreground">Improved</span>
							</div>
						</div>
						<div class="flex min-h-0 flex-1 flex-col gap-2">
							<h2 class="m-0 shrink-0 text-lg font-semibold text-foreground">
								Recent achievements
							</h2>
							<ul class="m-0 flex list-none flex-col gap-3 overflow-auto p-0">
								<li
									class="flex items-center justify-between gap-4 rounded-[10px] border border-border bg-card px-5 py-4 text-base"
								>
									<span class="font-medium text-foreground">3-Beat Weave</span>
									<span
										class="shrink-0 rounded-md bg-green-100 px-2.5 py-1 text-[13px] font-semibold text-green-800 dark:bg-green-900/30 dark:text-green-400"
									>
										Fully Polished
									</span>
								</li>
								<li
									class="flex items-center justify-between gap-4 rounded-[10px] border border-border bg-card px-5 py-4 text-base"
								>
									<span class="font-medium text-foreground">Spiral Wrap</span>
									<span
										class="shrink-0 rounded-md bg-amber-100 px-2.5 py-1 text-[13px] font-semibold text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
									>
										Getting Comfortable
									</span>
								</li>
							</ul>
						</div>
						<footer class="mt-0 shrink-0 text-right text-sm text-muted-foreground">
							flowpertoire.app
						</footer>
					</div>
				{/if}
			</PointyCard.Content>
		</PointyCard.Root>
	</AspectRatio>
</div>
