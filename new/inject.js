function isArticlePage() {
  // Simple heuristic to check if page is an article
  const article = document.querySelector("article");
  const paragraphs = document.querySelectorAll("p");
  return article || paragraphs.length > 5;
}

async function extractArticleContent() {
  if (!isArticlePage()) {
    console.log("This page does not appear to be an article");
    return;
  }

  // Get article content and title
  const articleElement =
    document.querySelector("article") ||
    document.querySelector("main") ||
    document.querySelector(".article") ||
    document.querySelector(".post-content");

  const titleElement =
    document.querySelector("h1") ||
    document.querySelector("title") ||
    document.querySelector(".article-title") ||
    document.querySelector(".post-title");

  if (articleElement && titleElement) {
    const content = articleElement.textContent.trim();
    const title = titleElement.textContent.trim();

    try {
      const result = await chrome.runtime.sendMessage({
        action: "classifyArticle",
        content: content,
        title: title,
      });

      if (result.error) {
        throw new Error(result.error);
      }
      updateFakeNewsStatus(result.prediction === "1");
    } catch (error) {
      console.error("Error classifying article:", error);
      updateFakeNewsStatus(null);
    }
  } else {
    console.log("Could not find article content or title");
    updateFakeNewsStatus(null);
  }
}

function updateFakeNewsStatus(isReal) {
  const fakeNewsStatus = document.getElementById("fake-news-status");
  if (!fakeNewsStatus) return;

  if (isReal === null) {
    fakeNewsStatus.innerHTML =
      '<div class="unknown"><p>Could not verify article</p></div>';
  } else if (isReal) {
    fakeNewsStatus.innerHTML =
      '<div class="true"><p>This article is real news</p></div>';
  } else {
    fakeNewsStatus.innerHTML =
      '<div class="false"><p>This article is fake news</p></div>';
  }
}

function createDraggableMenu() {
  const container = document.createElement("div");
  container.id = "fausses-nouvelles-container";

  // Move styles to CSS file
  container.innerHTML = `
      <div class="drag-handle">
        <main class="title">fausses nouvelles</main>
      </div>
      <hr />
      <div class="card">
        <h1>Fausses Nouvelles says...</h1>
        <p class="desc">(this result is using AI, may be inaccurate sometimes)</p>
        <div id="fake-news-status"></div>
      </div>
      <div class="card">
        <h1>Corroborated results</h1>
        <p class="desc">Results from other sources on the internet.</p>
        <div id="results"></div>
      </div>
    `;

  document.body.appendChild(container);
  makeDraggable(container);

  // Extract article content before running original script
  extractArticleContent();

  // Execute the original functionality directly
  originalScript();
}

function makeDraggable(element) {
  const dragHandle = element.querySelector(".drag-handle");
  let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;

  dragHandle.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    element.style.top = element.offsetTop - pos2 + "px";
    element.style.left = element.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

// Original script functionality
function originalScript() {
  const fake = false;
  const arr = [
    {
      title: "Biden walks into flames unknowingly",
      match: 74,
      url: "https://www.nytimes.com/",
      site: "The Washington Post",
      desc: "Biden accidentally walks into the flames while trying to recover his dog.",
    },
    {
      title:
        "What!? The President of the United States walks into flames unknowingly",
      match: 44,
      url: "https://www.nytimes.com/",
      site: "New York Times",
      desc: "Biden accidentally walks into the flames while trying to recover his dog.",
    },
    {
      title:
        "What!? The President of the United States walks into flames unknowingly",
      match: 14,
      url: "https://www.nytimes.com/",
      site: "New York Times",
      desc: "Biden accidentally walks into the flames while trying to recover his dog.",
    },
  ];

  const fakeNewsStatus = document.getElementById("fake-news-status");
  if (fakeNewsStatus) {
    fakeNewsStatus.innerHTML = fake
      ? '<div class="true"><p>This article is fake news</p></div>'
      : '<div class="false"><p>This article is not fake news</p></div>';
  }

  const results = document.getElementById("results");
  if (results) {
    arr.forEach((item, index) => {
      const resultDiv = document.createElement("div");
      resultDiv.className = "result";
      resultDiv.innerHTML = `
        <a href="${item.url}" target="blank">
          <span class="heading">
            <span class="logo"></span>
            <span class="site">${item.site}</span>
            ${
              item.match > 70
                ? `<span class="goodmatch">${item.match}% match</span>`
                : item.match < 40
                ? `<span class="badmatch">${item.match}% match</span>`
                : `<span class="midmatch">${item.match}% match</span>`
            }
          </span>
          <h3 class="posttitle">${item.title}</h3>
          <p class="desc2">${item.desc}</p>
        </a>
        `;
      results.appendChild(resultDiv);
    });
  }
}

// Initialize the menu
if (!document.getElementById("fausses-nouvelles-container")) {
  createDraggableMenu();
}
