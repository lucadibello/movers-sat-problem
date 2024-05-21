import { Forniture, SolveApiResponse } from "./index";

export async function solve(
	n_floors: number,
	n_movers: number,
	max_t: number,
	forniture: Forniture[],
): Promise<SolveApiResponse> {
	if (!process.env.REACT_APP_API_URL) {
		throw new Error("API URL not found");
	}

	const parameters = {
		n_floors: n_floors.toString(),
		n_movers: n_movers.toString(),
		max_steps: max_t.toString(),
	};
	// Build URL with query parameters
	const url_params = new URLSearchParams(parameters);
	const URL = process.env.REACT_APP_API_URL + "solve?" + url_params.toString();

	// Send request to backend
	const res = await fetch(URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(forniture),
	});

	// Now, we need to check if the answer was successfull
	if (!res.ok) {
		throw new Error("Solve API request failed.");
	}

	// Ensure response is a valid JSON
	if (!res.headers.get("content-type")?.startsWith("application/json")) {
		throw new Error("Feedback response is not JSON");
	}

	// Return the response back to the user
	return res.json();
}
