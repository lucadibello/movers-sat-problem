import { Box, HStack, Icon, IconButton, Text } from "@chakra-ui/react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

interface SimulationControlsProps {
	currentStep: number;
	totalSteps: number;
	onPrevious: () => void;
	onNext: () => void;
	isNextDisabled: boolean;
	isPreviousDisabled: boolean;
}

export default function SimulationControls({ isPreviousDisabled, isNextDisabled, currentStep, totalSteps, onPrevious, onNext }: SimulationControlsProps) {
	return (
		<HStack>
			{/* Previous button */}
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
		</HStack>
	)
}