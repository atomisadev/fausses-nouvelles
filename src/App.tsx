import "./App.css";

function App() {
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
  const fake = false;

  return (
    <>
      <main className="title">fausses nouvelles</main>
      <hr />
      <div className="card">
        <h1>Fausses Nouvelles says...</h1>
        <p className="desc">
          (this result is using AI, may be inaccurate sometimes)
        </p>

        {fake ? (
          <div className="true">
            <p className="">This article is not fake news</p>
          </div>
        ) : (
          <div className="false">
            <p className="">This article is fake news</p>
          </div>
        )}
      </div>

      <div className="card">
        <h1>Corroborated results</h1>
        <p className="desc">Results from other sources on the internet.</p>

        <div>
          {arr.map((item, index) => (
            <div key={index} className="result">
              <span className="heading">
                <span className="logo"></span>
                <span className="site">{item.site}</span>
                {item.match > 70 ? (
                  <span className="goodmatch">{item.match}% match</span>
                ) : item.match < 40 ? (
                  <span className="badmatch">{item.match}% match</span>
                ) : (
                  <span className="midmatch">{item.match}% match</span>
                )}
                <a href={item.url}></a>
              </span>

              <h3 className="posttitle">{item.title}</h3>
              <p className="desc2">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
