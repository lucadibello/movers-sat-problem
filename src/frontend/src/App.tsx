import * as React from "react";
import { Box, Container } from "@chakra-ui/react";
import { ProblemConfigurator } from "./components/ProblemConfigurator";
import { solve } from "services";

export const App = () => (
	<Box as="main" textAlign="center" fontSize="xl">
		<Container minH="100vh" p={4}>
			{/* Problem configurator */}
			<ProblemConfigurator
				onSubmit={(data) => {
					console.log("Submitted", data);

					// send request to the backend using service
					solve(data.n_floors, data.n_movers, data.max_t, [])
						.then((result) => {
							console.log("Result:", result);
						})
						.catch((error) => {
							console.error("Error:", error);
						})
				}}
			/>
		</Container>
	</Box>
);
