function extractFirstName(displayName, username) {
  const source = (displayName || username || '').trim();
  if (!source) return '';
  const cleaned = source.replace(/[@._\d]/g, ' ').trim();
  const firstToken = cleaned.split(/\s+/)[0];
  return firstToken || source.split(/[._]/)[0] || '';
}

export async function classifyGender(displayName, username) {
  const firstName = extractFirstName(displayName, username);
  if (!firstName || firstName.length < 2) {
    return { gender: 'unknown', probability: 0 };
  }

  try {
    const response = await fetch(
      `https://api.genderize.io?name=${encodeURIComponent(firstName)}`
    );

    if (!response.ok) {
      return { gender: 'unknown', probability: 0 };
    }

    const data = await response.json();

    if (!data.gender) {
      return { gender: 'unknown', probability: 0 };
    }

    const probability = Math.round((data.probability || 0) * 100);
    const gender = data.gender === 'male' ? 'male' : data.gender === 'female' ? 'female' : 'unknown';

    return { gender, probability };
  } catch {
    return { gender: 'unknown', probability: 0 };
  }
}

export async function classifyFollowingList(accounts) {
  const batchSize = 10;
  const classified = [];

  for (let i = 0; i < accounts.length; i += batchSize) {
    const batch = accounts.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map(async (account) => {
        const { gender, probability } = await classifyGender(
          account.displayName,
          account.username
        );
        return {
          username: account.username,
          display_name: account.displayName,
          profile_picture_url: account.profilePictureUrl,
          gender,
          gender_probability: probability,
        };
      })
    );
    classified.push(...results);
  }

  return classified;
}

export function groupByGender(classified) {
  const men = [];
  const women = [];
  const unknown = [];

  for (const account of classified) {
    const entry = {
      username: account.username,
      display_name: account.display_name,
      profile_picture_url: account.profile_picture_url,
      gender_probability: account.gender_probability,
    };

    if (account.gender === 'male') {
      men.push(entry);
    } else if (account.gender === 'female') {
      women.push(entry);
    } else {
      unknown.push(entry);
    }
  }

  return { men, women, unknown };
}
