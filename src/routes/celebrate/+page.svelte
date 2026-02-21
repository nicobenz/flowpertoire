<script lang="ts">
	import { toPng } from 'html-to-image';
	import ImageGenerator from '$lib/components/celebrate/ImageGenerator.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select/index.js';
	import { celebrateSettings } from '$lib/state/state.svelte';

	let exportTarget = $state<HTMLDivElement | null>(null);
	let downloading = $state(false);

	function onExportReady(el: HTMLDivElement) {
		exportTarget = el;
	}

	async function handleDownload() {
		if (!exportTarget) return;
		downloading = true;
		try {
			const dataUrl = await toPng(exportTarget, {
				pixelRatio: 1080 / exportTarget.offsetWidth,
				cacheBust: true
			});
			const link = document.createElement('a');
			link.download = 'flowpertoire-celebrate.png';
			link.href = dataUrl;
			link.click();
		} finally {
			downloading = false;
		}
	}

	const timeTriggerContent = $derived(
		celebrateSettings.timeOptions.find((f) => f.value === celebrateSettings.timeSelection.value)
			?.label
	);

	const styleTriggerContent = $derived(
		celebrateSettings.styleOptions.find((f) => f.value === celebrateSettings.styleSelection.value)
			?.label
	);
</script>

<div class="m-0 flex min-h-0 max-w-3xl flex-col gap-8 p-8 pr-8 pl-0 md:flex-row">
	<aside class="flex w-fit shrink-0 flex-col gap-6">
		<h2 class="m-0 text-lg font-semibold text-foreground">Configuration</h2>
		<div class="flex flex-col gap-4">
			<div class="flex flex-col gap-1.5">
				<Select.Root type="single" bind:value={celebrateSettings.timeSelection.value}>
					<Select.Trigger class="w-[180px]">
						{timeTriggerContent}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Time ranges</Select.Label>
							{#each celebrateSettings.timeOptions as time (time.value)}
								<Select.Item value={time.value} label={time.label}>
									{time.label}
								</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</div>
			<div class="flex flex-col gap-1.5">
				<Select.Root type="single" bind:value={celebrateSettings.styleSelection.value}>
					<Select.Trigger class="w-[180px]">
						{styleTriggerContent}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Style</Select.Label>
							{#each celebrateSettings.styleOptions as style (style.value)}
								<Select.Item value={style.value} label={style.label}>
									{style.label}
								</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</div>
		</div>
		<div class="mt-auto min-w-40">
			<Button onclick={handleDownload} disabled={!exportTarget || downloading}>
				{downloading ? 'Preparing…' : 'Download'}
			</Button>
		</div>
	</aside>
	<div class="flex min-w-0 flex-1 items-start justify-center">
		<ImageGenerator exportReady={onExportReady} />
	</div>
</div>
