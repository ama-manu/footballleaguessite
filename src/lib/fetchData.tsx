// "use client";
// import useSWR from "swr";

// const fetcher = (url: string) => fetch(url).then((res) => res.json());

async function fetchData(url: string) {
	// using fetch()
		try {
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			return await response.json();
		} catch (error) {
			console.error("Fetch error:", error);
			return null;
		}
	}

// function fetchData(url: string) {
// 	const { data, error, isLoading } = useSWR(url, fetcher);
// 	return { data, error, isLoading };
// }

export default fetchData;
