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
    title: "What!? The President of the United States walks into flames unknowingly",
    match: 44,
    url: "https://www.nytimes.com/",
    site: "New York Times",
    desc: "Biden accidentally walks into the flames while trying to recover his dog.",
  },
  {
    title: "What!? The President of the United States walks into flames unknowingly",
    match: 14,
    url: "https://www.nytimes.com/",
    site: "New York Times",
    desc: "Biden accidentally walks into the flames while trying to recover his dog.",
  },
];

window.addEventListener("load", () => {
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
          ${item.match > 70 ? `<span class="goodmatch">${item.match}% match</span>` : item.match < 40 ? `<span class="badmatch">${item.match}% match</span>` : `<span class="midmatch">${item.match}% match</span>`}
        </span>
        <h3 class="posttitle">${item.title}</h3>
        <p class="desc2">${item.desc}</p>
      </a>
      `;
      results.appendChild(resultDiv);
    });
  }
});
