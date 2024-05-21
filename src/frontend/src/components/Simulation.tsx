import { useState, useEffect } from "react"
import { Box, Button, HStack, Stack, Text, VStack } from "@chakra-ui/react"
import { MoverWithAction, SimulationStep } from "services/solver-service"
import SimulationControls from "./SimulationControls"
import { useMovers } from "contexts/MoverContext"
import { FornitureIcon } from "./FornitureIcon"
import { FornitureItem } from "util/forniture"
import { FaHardHat } from "react-icons/fa"

interface SimulationFloorsProps {
	n_floors: number
	state: SimulationStep
}

const getActionName = (mover: MoverWithAction) => {
	if (!mover.action) {
		return "Idle"
	}
	switch (mover.action?.type) {
		case "carry":
			// Extract the item ID from the data
			const itemID = mover.action.data!.forniture
			return `Carrying #${itemID}`
		case "ascend":
			return "Ascending"
		case "descend":
			return "Descending"
		default:
			return "Unknown"
	}
}

const getActionColor = (mover: MoverWithAction) => {
	if (!mover.action) {
		return "gray.500"
	}
	switch (mover.action?.type) {
		case "carry":
			return "green.500"
		case "ascend":
			return "blue.500"
		case "descend":
			return "blue.500"
		default:
			return "gray.500"
	}
}

function SimulationFloors({ n_floors, state }: SimulationFloorsProps) {
	// Load the forniture map from the context
	const { fornitureMap } = useMovers()

	// Convert all forniture to FornitureItem
	const [forniture, setForniture] = useState<FornitureItem[]>([])
	useEffect(() => {
		const localForniture: FornitureItem[] = []
		state.forniture.forEach((f) => {
			// Lookup item in the map by ID
			const item = fornitureMap.get(f.name)
			if (item) {
				// Ensure that the item is not already in the list
				if (!localForniture.find((i) => i.id === item.id)) {
					localForniture.push({
						...item,
						floor: f.floor
					})
				}
			}
		})
		setForniture(localForniture)
	}, [fornitureMap, state.forniture])
	return (
		<VStack minH="70vh" w="full" spacing={4} align="center" justify="center">
			{[...Array(n_floors)].map((_, index) => (
				<VStack w="full" key={index}>
					<Text>
						{n_floors - index - 1 === 0 ? "Ground Floor" : "Floor #" + (n_floors - index - 1)}
					</Text>
					{/* Render the floor */}
					<Box
						w="full"
						p={4}
						borderWidth={1}
						borderRadius="lg"
						boxShadow="md"
						minH={"9em"}
					>
						{/* Render the items */}
						<HStack gap={2}>
							{forniture.filter((item) => item.floor === n_floors - index - 1).map((item, index) => (
								<Box key={index} mb={2}>
									<FornitureIcon
										name={item.name}
										icon={item.icon}
										showBadge={true}
										badgeColor="gray.500"
										badgeText={"#" + String(item.id) || "Unknown"}
										isBadgeSmall={true}
									/>
								</Box>
							))}
							{state.movers.filter((mover) => mover.floor === n_floors - index - 1).map((mover, index) => (
								<Box key={index} mb={2}>
									<FornitureIcon
										name={mover.name}
										icon={FaHardHat}
										showBadge={true}
										badgeColor={getActionColor(mover)}
										badgeText={getActionName(mover)}
									/>
								</Box>
							))}
						</HStack>
					</Box>
				</VStack>
			))}
		</VStack>
	)
}

interface SimulationProps {
	simulationSteps: SimulationStep[]
	totalSteps: number
	onDone: () => void
}

export default function Simulation({ simulationSteps, totalSteps, onDone }: SimulationProps) {
	const [currentTimeStep, setCurrentTimeStep] = useState(0)
	const [simulationStep, setSimulationStep] = useState<SimulationStep>(simulationSteps[currentTimeStep])

	// Load settings from the context
	const { floors, reset } = useMovers()

	// Update the simulation step when the current step changes
	useEffect(() => {
		setSimulationStep(simulationSteps[currentTimeStep])
	}, [currentTimeStep, simulationSteps])

	console.log(simulationStep)

	// Render the step
	return (
		<Stack w="full" minH="70vh" spacing={4}>
			{/* Actual simulation */}
			<SimulationFloors n_floors={floors} state={simulationStep} />

			{/* Simulation controls */}
			<VStack w="full" justify="center">
				<SimulationControls
					currentStep={currentTimeStep + 1}
					isPreviousDisabled={currentTimeStep === 0}
					isNextDisabled={currentTimeStep === totalSteps - 1}
					totalSteps={totalSteps}
					onPrevious={() => setCurrentTimeStep(currentTimeStep - 1)}
					onNext={() => setCurrentTimeStep(currentTimeStep + 1)}
					onFirst={() => setCurrentTimeStep(0)}
					onLast={() => setCurrentTimeStep(totalSteps - 1)}
				/>
			</VStack>

			{/* Simulation status */}
			<VStack w="full" align="center">
				<Button
					w="full"
					onClick={onDone}
					variant={"link"}
				>
					Solve another problem
				</Button>
			</VStack>
		</Stack>
	)
}