"use client";
import countries from "./leagues";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// fetch data from url
function fetchData(url: string) {
	return useSWR(
		url,
		fetcher,
	);
}

// example component that uses fetchData
function FetchDataComponent( { url }: { url: string }) {
	const { data, error, isLoading } = fetchData(url);

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Error: {error.message}</div>;

	return (
		<div>
			<h2>{countries[0].leagues[0].name}</h2>
			<ul>
				{data.map((match: any) => (
					<li key={match.MatchID + crypto.randomUUID()}>
						{match.group.groupName} - {match.team1.teamName} vs{" "}
						{match.team2.teamName}
					</li>
				))}
			</ul>
		</div>
	);
}

export { fetchData, FetchDataComponent };
