import { config } from '../config.js';

const APIFY_ACTOR_ID =
  'coderx~instagram-followers-following-scraper-no-cookies-login';
const POLL_INTERVAL_MS = 5000;
const MAX_POLL_ATTEMPTS = 120;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchInstagramFollowing(username) {
  const handle = username.replace(/^@/, '').trim();
  const input = {
    username: handle,
    scrape_type: 'following',
    max_items: 500,
  };

  console.log('[Apify] input:', JSON.stringify(input, null, 2));

  const runResponse = await fetch(
    `https://api.apify.com/v2/acts/${APIFY_ACTOR_ID}/runs?token=${config.apifyToken}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }
  );

  if (!runResponse.ok) {
    const errorText = await runResponse.text();
    throw new Error(`Apify run failed: ${runResponse.status} ${errorText}`);
  }

  const runData = await runResponse.json();
  const runId = runData.data?.id;
  const datasetId = runData.data?.defaultDatasetId;

  if (!runId || !datasetId) {
    throw new Error('Apify run response missing run id or dataset id');
  }

  let runStatus = runData.data?.status;

  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
    if (runStatus === 'SUCCEEDED') break;
    if (runStatus === 'FAILED' || runStatus === 'ABORTED' || runStatus === 'TIMED-OUT') {
      throw new Error(`Apify run ended with status: ${runStatus}`);
    }

    await sleep(POLL_INTERVAL_MS);

    const statusResponse = await fetch(
      `https://api.apify.com/v2/actor-runs/${runId}?token=${config.apifyToken}`
    );

    if (!statusResponse.ok) {
      const errorText = await statusResponse.text();
      throw new Error(`Apify status check failed: ${statusResponse.status} ${errorText}`);
    }

    const statusData = await statusResponse.json();
    runStatus = statusData.data?.status;
  }

  if (runStatus !== 'SUCCEEDED') {
    throw new Error('Apify run timed out waiting for completion');
  }

  const itemsResponse = await fetch(
    `https://api.apify.com/v2/datasets/${datasetId}/items?token=${config.apifyToken}`
  );

  if (!itemsResponse.ok) {
    const errorText = await itemsResponse.text();
    throw new Error(`Apify dataset fetch failed: ${itemsResponse.status} ${errorText}`);
  }

  const items = await itemsResponse.json();

  console.log('[Apify] status:', itemsResponse.status);
  console.log('[Apify] raw response:', JSON.stringify(items, null, 2));

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
