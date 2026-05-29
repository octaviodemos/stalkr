import { config } from '../config.js';

const APIFY_ACTOR =
  process.env.APIFY_ACTOR_ID || 'TODO_APIFY_ACTOR_ID';

export async function fetchInstagramFollowing(username) {
  const actorId = APIFY_ACTOR.replace('/', '~');
  const runResponse = await fetch(
    `https://api.apify.com/v2/acts/${actorId}/run-sync-get-dataset-items?token=${config.apifyToken}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.replace(/^@/, ''),
        resultsLimit: 500,
      }),
    }
  );

  if (!runResponse.ok) {
    const errorText = await runResponse.text();
    throw new Error(`Apify request failed: ${runResponse.status} ${errorText}`);
  }

  const items = await runResponse.json();

  if (!Array.isArray(items) || items.length === 0) {
    return [];
  }

  return items.map((item) => ({
    username: item.username || item.userName || '',
    displayName: item.fullName || item.full_name || item.username || '',
    profilePictureUrl:
      item.profilePicUrl || item.profile_pic_url || item.profilePicture || '',
  }));
}
