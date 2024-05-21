import * as React from "react";
import { Box, Container, VStack } from "@chakra-ui/react";
import { ProblemConfigurator } from "./components/ProblemConfigurator";
import ConfiguratorStepper from "components/ConfiguratorStepper";
import { useMovers } from "contexts/MoverContext";
import ElementStepper from "components/ElementStepper";
import FornitureConfigurator from "components/FornitureConfiguration";

export const App = () => {
	// React state to keep track of active configuration step
	const [activeStep, setActiveStep] = React.useState(0);

	// Load the context hook
	const { setFloors, setNumberOfMovers, setMaxTime } = useMovers()

	// Return the JSX component
	return (
		<Box as="main" textAlign="center" fontSize="xl">
			<Container minH="100vh" p={4}>
				<VStack spacing={4} align="center" justify="center">
					{ /* Step 1: Problem configurator */}
					{ /* Step 2: Configure the forniture placement */}
					<ElementStepper activeStep={activeStep} elements={[
						<ProblemConfigurator
							onSubmit={(data) => {
								// save data inside the context
								setFloors(data.n_floors)
								setNumberOfMovers(data.n_movers)
								setMaxTime(data.max_t)
								// proceed to next step
								setActiveStep(1)
							}}
						/>,
						<FornitureConfigurator />,
						<div>Step 3</div>,
					]} />
				</VStack>

				{/* Stepper */}
				<ConfiguratorStepper
					activeStep={activeStep}
					goToStep={(step) => {
						setActiveStep(step)
					}}
				/>
			</Container>
		</Box>
	)
};
