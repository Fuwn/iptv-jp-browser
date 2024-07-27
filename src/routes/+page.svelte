<script lang="ts">
	import { browser } from '$app/environment';
	import { parseM3U, type Channel } from '$lib/m3u';
	import { onMount } from 'svelte';
	import Masonry from 'svelte-bricks';

	let channels: Channel[] = [];
	let filter = '';

	onMount(
		async () =>
			(channels = parseM3U(
				await (await fetch('https://raw.githubusercontent.com/luongz/iptv-jp/main/jp.m3u')).text()
			)
				.filter((channel) => channel.tvgLogo)
				.map((channel, index) => ({ ...channel, id: index })))
	);
</script>

<input type="text" placeholder="Search" bind:value={filter} class="filter" />

<div class="channels">
	<Masonry
		items={channels.filter((channel) =>
			(
				channel.name.toLowerCase() +
				channel.groupTitle.toLowerCase() +
				channel.tvgId.toLowerCase()
			).includes(filter.toLowerCase())
		)}
		minColWidth={(browser ? window.innerWidth < 768 : false) ? 150 : 200}
		gap={15}
		let:item
	>
		<div class="channel-container">
			<a href={`https://hlsjs.video-dev.org/demo/?src=${item.url}`} target="_blank">
				<img src={item.tvgLogo} alt="Channel icon" class="channel-icon" />
			</a>

			<span class="channel-title">
				<a
					href={`https://hlsjs.video-dev.org/demo/?src=${item.url}`}
					target="_blank"
					class="channel-title-primary"
				>
					[{item.groupTitle}] {item.name}
				</a>

				<br />

				<a
					href={'#'}
					on:click={() => {
						navigator.clipboard.writeText(item.url);
						alert('Copied M3U8 URL to clipboard!');
					}}
				>
					Copy M3U8 URL
				</a>
			</span>
		</div>
	</Masonry>
</div>

<style>
	:root {
		--border-radius: 8px;
		--space: 1rem;
	}

	a {
		text-decoration: none;
		color: #c6c6c6;
		transition: color 0.1s ease-in-out;
	}

	a:hover {
		color: #ffb600;
	}

	::selection {
		background: #ffb600;
		color: #fff;
	}

	.channels {
		padding: calc(var(--space) / 2);
	}

	.channel-container {
		background: #1d1d1d;
		padding: var(--space);
		border-radius: var(--border-radius);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
		position: relative;
	}

	.channel-icon {
		border-radius: var(--border-radius);
		max-width: 100%;
		max-height: 100%;
		margin-bottom: var(--space);
	}

	.filter {
		width: calc(100% - (var(--space) * 3));
		padding: var(--space);
		border-radius: var(--border-radius);
		border: none;
		margin: calc(var(--space) / 2);
		background: #242424;
		border: none;
		color: #fff;
		font-size: 1rem;
	}

	.filter:focus {
		outline: none;
	}

	.channel-title-primary {
		color: #fff;
	}

	:global(body) {
		background-color: #121212;
		color: #fff;
	}
</style>
