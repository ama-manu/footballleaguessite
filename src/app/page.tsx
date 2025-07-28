import Leagues from "../lib/leagues";

export default function Home() {
  return (
    <main>
      <h1>Welcome to the Football Leagues Site</h1>
      <p>
        This is the home page. Navigate to a specific league to see more
        details.
      </p>
      <ul>
        {Leagues.map((country) => (
          country.leagues.map((league) => (
            <li key={`${country.internalURL}-${league.internalURL}`}>
              <a href={`/${country.internalURL}/${league.internalURL}`}>
                {country.name} - {league.name}
              </a>
            </li>
          ))
        ))}
      </ul>
    </main>
  );
}
