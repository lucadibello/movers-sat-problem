import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { useMovers } from "contexts/MoverContext";
import { useEffect, useState } from "react";
import { solve } from "services";
import { Forniture, SolveResponse } from "services/solver-service";
import Simulation from "./Simulation";

interface SolverRequestProps {
	onSubmit: () => void;
	onReset?: () => void;
}

export default function SolverRequest({ onSubmit, onReset }: SolverRequestProps) {
	// React states
	const [loading, setLoading] = useState(true)
	const [message, setMessage] = useState<string | null>(null)
	const [isError, setError] = useState(false)
	const [data, setData] = useState<SolveResponse | null>(null)

	// Load context to access data
	const { floors, maxTime, numberOfMovers, forniture, addMover } = useMovers()

	// Prepare forniture
	const actualForniture: Forniture[] = forniture.filter((f) => f.floor !== null && f.id !== null).map((f) => ({
		name: f.id!,
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
					// Add movers to the context
					res.data.movers_names.forEach((mover_name) => addMover({
						name: mover_name,
						floor: 0
					}))
				} else {
					setMessage(res.message)
					setData(null)
					console.error(res.message)
				}
			}).catch((error) => {
				console.error(error)
				setError(true)
				setMessage("An error occurred while processing the request: " + error.message)
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
							An error occurred
						</AlertTitle>
						<AlertDescription maxWidth='sm'>
							{message}
						</AlertDescription>
						{onReset && (
							<Button onClick={onReset} mt={4}>
								Return to the main page
							</Button>
						)}
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
					onDone={() => {
						onReset && onReset()
					}}
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
		<Box minH="70vh" w="full">
			<Heading as="h1" size="lg">Solver Request</Heading>
			{children}
		</Box>
	)
}
