export const publishToSquarespace = async (draftMarkdown: string): Promise<{ success: boolean; message: string }> => {
  const apiKey = process.env.SQUARESPACE_API_KEY;
  const siteId = process.env.SQUARESPACE_SITE_ID;

  if (!apiKey || !siteId) {
    return {
      success: false,
      message: "Missing SQUARESPACE_API_KEY or SQUARESPACE_SITE_ID."
    };
  }

  const response = await fetch(`https://api.squarespace.com/1.0/sites/${siteId}/blog-posts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: "New Portfolio Case Study",
      body: draftMarkdown,
      status: "DRAFT"
    })
  });

  if (!response.ok) {
    return {
      success: false,
      message: `Squarespace publish failed with status ${response.status}.`
    };
  }

  return { success: true, message: "Draft published to Squarespace." };
};
