async function classifyArticle(content, title) {
  try {
    const response = await fetch("http://132.145.162.209/api/nlp/classify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: content,
        title: title,
      }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error classifying article:", error);
    return null;
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "classifyArticle") {
    classifyArticle(request.content, request.title)
      .then((result) => sendResponse(result))
      .catch((error) => sendResponse({ error: error.message }));
    return true; // Keep message channel open for async response
  }
});

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["inject.js"],
  });
  chrome.scripting.insertCSS({
    target: { tabId: tab.id },
    files: ["index.css"],
  });
});
