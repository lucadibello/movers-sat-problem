import { Box, HStack, Icon, IconButton, Text } from "@chakra-ui/react";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight } from "react-icons/fa";

interface SimulationControlsProps {
	currentStep: number;
	totalSteps: number;
	onPrevious: () => void;
	onNext: () => void;
	onFirst: () => void;
	onLast: () => void;
	isNextDisabled: boolean;
	isPreviousDisabled: boolean;
}

export default function SimulationControls({
	isPreviousDisabled,
	isNextDisabled,
	currentStep,
	totalSteps,
	onPrevious,
	onNext,
	onFirst,
	onLast
}: SimulationControlsProps) {
	return (
		<HStack>
			<IconButton
				aria-label="First step"
				icon={<Icon as={FaAngleDoubleLeft} />}
				isDisabled={isPreviousDisabled}
				onClick={onFirst}
			/>
			<IconButton
				aria-label="Previous step"
				icon={<Icon as={FaAngleLeft} />}
				isDisabled={isPreviousDisabled}
				onClick={onPrevious}
			/>
			<Box>
				<Text>{currentStep} of {totalSteps}</Text>
			</Box>
			<IconButton
				aria-label="Next step"
				icon={<Icon as={FaAngleRight} />}
				isDisabled={isNextDisabled}
				onClick={onNext}
			/>
			<IconButton
				aria-label="Last step"
				icon={<Icon as={FaAngleDoubleRight} />}
				isDisabled={isNextDisabled}
				onClick={onLast}
			/>
		</HStack>
	)
}