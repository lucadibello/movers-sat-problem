import * as React from "react";
import { Box, Container, Heading, VStack } from "@chakra-ui/react";
import { ProblemConfigurator } from "./components/ProblemConfigurator";
import ConfiguratorStepper from "components/ConfiguratorStepper";
import { useMovers } from "contexts/MoverContext";
import ElementStepper from "components/ElementStepper";
import FornitureConfigurator from "components/FornitureConfiguration";
import SolverRequest from "components/SolverRequest";

export const App = () => {
	// React state to keep track of active configuration step
	const [activeStep, setActiveStep] = React.useState(0);

	// Load the context hook
	const { setFloors, setNumberOfMovers, setMaxTime, reset } = useMovers()

	// Return the JSX component
	return (
		<Box as="main" textAlign="center" fontSize="xl">
			<Container minH="80vh" p={4}>
				<VStack spacing={4} align="center" justify="center">
					{ /* Step 1: Problem configurator */}
					{ /* Step 2: Configure the forniture placement */}
					<ElementStepper activeStep={activeStep} elements={[
						<Box w="full" minH={"70vh"}>
							<Heading as="h1" pb={10} size="lg">Configure your problem instance</Heading>
							<ProblemConfigurator
								onSubmit={(data) => {
									// save data inside the context
									setFloors(data.n_floors)
									setNumberOfMovers(data.n_movers)
									setMaxTime(data.max_t)
									// proceed to next step
									setActiveStep(1)
								}}
							/>
						</Box>,
						<FornitureConfigurator
							onSubmit={() => {
								setActiveStep(2)
							}}
							onBack={() => {
								setActiveStep(0)
							}}
						/>,
						<SolverRequest
							onSubmit={() => {
								setActiveStep(3)
							}}
							onReset={() => {
								reset()
								setActiveStep(0)
							}}
						/>
					]} />
				</VStack>
				<Box mt={10} w="full">
					<ConfiguratorStepper
						activeStep={activeStep}
						goToStep={(step) => {
							setActiveStep(step)
						}}
					/>
				</Box>
			</Container>
		</Box>
	)
};
