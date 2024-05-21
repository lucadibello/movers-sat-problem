import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Flex, HStack, Heading, Spinner, Stack, Text } from "@chakra-ui/react";
import { useMovers } from "contexts/MoverContext";
import { useEffect, useState } from "react";
import { solve } from "services";
import { Forniture, SimulationStep, SolveResponse } from "services/solver-service";
import SimulationControls from "./SimulationControls";

interface SolverRequestProps {
	onSubmit: () => void;
}

export default function SolverRequest({ onSubmit }: SolverRequestProps) {
	// React states
	const [loading, setLoading] = useState(true)
	const [message, setMessage] = useState<string | null>(null)
	const [isError, setError] = useState(false)
	const [data, setData] = useState<SolveResponse | null>(null)

	// Load context to access data
	const { floors, maxTime, numberOfMovers, forniture, addMover } = useMovers()

	// Prepare forniture
	const actualForniture: Forniture[] = forniture.filter((f) => f.floor !== null).map((f) => ({
		name: f.name,
		floor: f.floor!
	}))

	useEffect(() => {
		// send request to the server
		setLoading(true)
		solve(floors, numberOfMovers, maxTime, actualForniture)
			.then((res) => {
				if (res.success) {
					setMessage(res.message)
					setData(res.data)
					setError(false)
					console.log(res.data)

					// Add movers to the context
					res.data.movers_names.forEach((mover_name) => addMover({
						name: mover_name,
						floor: 0
					}))
				} else {
					setMessage(res.message)
					setData(null)
					console.error(res.message)
					setError(true)
				}
			}).catch((error) => {
				console.error(error)
				setError(true)
				setMessage("Error while processing the request")
				setData(null)
			}).finally(() => {
				setLoading(false)
			})
	}, [])

	if (loading) {
		return (
			<PageWrapper>
				<Flex minH="100vh" justify="center" align="center">
					<Spinner />
				</Flex>
			</PageWrapper>
		)
	}
	if (isError) {
		return (
			<PageWrapper>
				<Flex minH="70vh" justify="center" align="center">
					<Alert
						status='error'
						variant='subtle'
						flexDirection='column'
						alignItems='center'
						justifyContent='center'
						textAlign='center'
						minHeight='200px'
					>
						<AlertIcon boxSize='40px' mr={0} />
						<AlertTitle mt={4} mb={1} fontSize='lg'>
							Error while processing the request
						</AlertTitle>
						<AlertDescription maxWidth='sm'>
							{message}
						</AlertDescription>
					</Alert>
				</Flex>
			</PageWrapper>
		)
	}

	if (!loading && !isError) {
		return (
			<PageWrapper>
				{/* Show the message */}
				<Simulation
					simulationSteps={data!.simulation_steps}
					totalSteps={data!.total_steps}
				/>
			</PageWrapper>
		)
	}

	return (
		<PageWrapper>
			<Text>Unknown error</Text>
		</PageWrapper>
	)
}

function PageWrapper({ children }: { children: React.ReactNode }) {
	return (
		<Box minH="70vh">
			<Heading as="h1" size="lg">Solver Request</Heading>
			{children}
		</Box>
	)
}

function Simulation({ simulationSteps, totalSteps }: { simulationSteps: SimulationStep[], totalSteps: number }) {
	const [currentTimeStep, setCurrentTimeStep] = useState(0)
	const [simulationStep, setSimulationStep] = useState<SimulationStep>(simulationSteps[currentTimeStep])

	// Update the simulation step when the current step changes
	useEffect(() => {
		setSimulationStep(simulationSteps[currentTimeStep])
	}, [currentTimeStep, simulationSteps])

	console.log("Simulation", simulationStep)

	// Render the step
	return (
		<Stack w="full" h="full">
			<Text>Current {JSON.stringify(simulationStep)}</Text>
			<Text>Total steps: {totalSteps}</Text>
			<SimulationControls
				currentStep={currentTimeStep + 1}
				isPreviousDisabled={currentTimeStep === 0}
				isNextDisabled={currentTimeStep === totalSteps - 1}
				totalSteps={totalSteps}
				onPrevious={() => setCurrentTimeStep(currentTimeStep - 1)}
				onNext={() => setCurrentTimeStep(currentTimeStep + 1)}
			/>
		</Stack>
	)
}