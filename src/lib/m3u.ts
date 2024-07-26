export interface Channel {
	groupTitle: string;
	tvgId: string;
	tvgLogo: string;
	name: string;
	url: string;
}

export const parseM3U = (m3uContent: string): Channel[] => {
	const lines = m3uContent.split('\n');
	const channels: Channel[] = [];
	let currentChannel: Partial<Channel> = {};

	for (const line of lines)
		if (line.startsWith('#EXTINF')) {
			const groupTitleMatch = line.match(/group-title="([^"]*)"/);
			const tvgIdMatch = line.match(/tvg-id="([^"]*)"/);
			const tvgLogoMatch = line.match(/tvg-logo="([^"]*)"/);
			const nameMatch = line.match(/,([^,]*)$/);

			currentChannel = {
				groupTitle: groupTitleMatch ? groupTitleMatch[1].trim() : '',
				tvgId: tvgIdMatch ? tvgIdMatch[1].trim() : '',
				tvgLogo: tvgLogoMatch ? tvgLogoMatch[1].trim() : '',
				name: nameMatch ? nameMatch[1].trim() : ''
			};
		} else if (line && !line.startsWith('#')) {
			currentChannel.url = line.trim();

			channels.push(currentChannel as Channel);

			currentChannel = {};
		}

	return channels;
};
