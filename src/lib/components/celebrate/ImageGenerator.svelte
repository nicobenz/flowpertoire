<script lang="ts">
	import type { Snippet } from 'svelte';

	/** Portrait 4:5, Instagram feed (1080×1350). */
	const WIDTH = 1080;
	const HEIGHT = 1350;

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

<div class="preview-wrapper">
	<div bind:this={cardEl} class="card" role="img" aria-label="Instagram image preview">
		<div class="content-area">
			{#if children}
				{@render children()}
			{:else}
				<div class="dashboard">
					<header class="dashboard-header">
						<h1 class="dashboard-title">Flowpertoire</h1>
						<p class="dashboard-subtitle">Skill Progress</p>
					</header>
					<div class="dashboard-stats">
						<div class="stat-card">
							<span class="stat-value">12</span>
							<span class="stat-label">Practiced</span>
						</div>
						<div class="stat-card">
							<span class="stat-value">5</span>
							<span class="stat-label">Started</span>
						</div>
						<div class="stat-card">
							<span class="stat-value">4</span>
							<span class="stat-label">Polished</span>
						</div>
					</div>
					<div class="dashboard-section">
						<h2 class="section-title">Recent achievements</h2>
						<ul class="achievement-list">
							<li class="achievement-item">
								<span class="achievement-name">Spiral Wrap</span>
								<span class="achievement-badge">Confident</span>
							</li>
							<li class="achievement-item">
								<span class="achievement-name">3-Beat Weave</span>
								<span class="achievement-badge">Polished</span>
							</li>
						</ul>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.preview-wrapper {
		width: 100%;
		max-width: min(28rem, 75vw);
		margin: 0 auto;
		padding: 1.5rem 0;
	}

	.card {
		position: relative;
		width: 1080px;
		height: 1350px;
		max-width: 100%;
		height: auto;
		aspect-ratio: 1080 / 1350;
		background: var(--color-background, #fff);
		box-sizing: border-box;
		box-shadow:
			0 4px 6px -1px rgb(0 0 0 / 0.1),
			0 2px 4px -2px rgb(0 0 0 / 0.1),
			0 25px 50px -12px rgb(0 0 0 / 0.25);
	}

	.content-area {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.dashboard {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		padding: 56px 48px;
		box-sizing: border-box;
		gap: 40px;
	}

	.dashboard-header {
		flex-shrink: 0;
	}

	.dashboard-title {
		margin: 0;
		font-size: 36px;
		font-weight: 700;
		letter-spacing: -0.02em;
		color: #0f172a;
		line-height: 1.2;
	}

	.dashboard-subtitle {
		margin: 8px 0 0;
		font-size: 20px;
		font-weight: 500;
		color: #64748b;
	}

	.dashboard-stats {
		display: flex;
		gap: 24px;
		flex-shrink: 0;
	}

	.stat-card {
		flex: 1;
		background: #f8fafc;
		border: 1px solid #e2e8f0;
		border-radius: 12px;
		padding: 24px;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.stat-value {
		font-size: 32px;
		font-weight: 700;
		color: #0f172a;
		line-height: 1;
	}

	.stat-label {
		font-size: 14px;
		color: #64748b;
		font-weight: 500;
	}

	.dashboard-section {
		flex: 1;
		min-height: 0;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.section-title {
		margin: 0;
		font-size: 18px;
		font-weight: 600;
		color: #334155;
		flex-shrink: 0;
	}

	.achievement-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 12px;
		overflow: auto;
	}

	.achievement-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 16px 20px;
		background: #fff;
		border: 1px solid #e2e8f0;
		border-radius: 10px;
		font-size: 16px;
	}

	.achievement-name {
		font-weight: 500;
		color: #0f172a;
	}

	.achievement-badge {
		font-size: 13px;
		font-weight: 600;
		padding: 4px 10px;
		border-radius: 6px;
		flex-shrink: 0;
	}

	.achievement-item:first-child .achievement-badge,
	.achievement-item:nth-child(2) .achievement-badge {
		background: #dcfce7;
		color: #166534;
	}

	.achievement-item:nth-child(3) .achievement-badge {
		background: #fef3c7;
		color: #92400e;
	}

	.achievement-item:nth-child(4) .achievement-badge {
		background: #f1f5f9;
		color: #64748b;
	}
</style>
