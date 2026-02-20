<script lang="ts">
	import { toPng } from 'html-to-image';
	import ImageGenerator from '$lib/components/celebrate/ImageGenerator.svelte';
	import { Button } from '$lib/components/ui/button';

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
</script>

<div class="celebrate-page">
	<aside class="settings-panel">
		<h2 class="settings-title">Settings</h2>
		<div class="settings-list">
			<div class="setting-row">
				<label for="time-range">Time range</label>
				<select id="time-range" class="setting-input">
					<option>All time</option>
					<option>Last 3 months</option>
					<option>Last 6 months</option>
				</select>
			</div>
			<div class="setting-row">
				<label for="style">Style</label>
				<select id="style" class="setting-input">
					<option>Style 1</option>
					<option>Style 2</option>
				</select>
			</div>
		</div>
		<div class="download-wrap">
			<Button
				onclick={handleDownload}
				disabled={!exportTarget || downloading}
			>
				{downloading ? 'Preparing…' : 'Download'}
			</Button>
		</div>
	</aside>
	<div class="preview-panel">
		<ImageGenerator exportReady={onExportReady} />
	</div>
</div>

<style>
	.celebrate-page {
		display: flex;
		flex-direction: row;
		gap: 2rem;
		padding: 2rem 2rem 2rem 0;
		min-height: 0;
		max-width: 56rem;
		margin: 0;
	}

	@media (max-width: 768px) {
		.celebrate-page {
			flex-direction: column;
		}
	}

	.settings-panel {
		flex-shrink: 0;
		width: 16rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.settings-title {
		margin: 0;
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--color-foreground, #0f172a);
	}

	.settings-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.setting-row {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.setting-row label {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-muted-foreground, #64748b);
	}

	.setting-input {
		padding: 0.5rem 0.75rem;
		font-size: 0.875rem;
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 6px;
		background: var(--color-background, #fff);
		color: var(--color-foreground, #0f172a);
	}

	.download-wrap {
		margin-top: auto;
		min-width: 10rem;
	}

	.preview-panel {
		flex: 1;
		min-width: 0;
		display: flex;
		align-items: flex-start;
		justify-content: center;
	}
</style>
