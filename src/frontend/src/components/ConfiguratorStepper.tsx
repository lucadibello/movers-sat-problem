import { Box, Step, StepDescription, StepIcon, StepIndicator, StepNumber, StepSeparator, StepStatus, StepTitle, Stepper, useToast } from "@chakra-ui/react";

const steps = [
	{ title: 'Definition', description: 'Define the problem' },
	{ title: 'Setup', description: 'Arrange forniture' },
	{ title: 'SAT Solver', description: 'Solve the problem' }
]

interface ConfiguratorStepperProps {
	activeStep: number;
	goToStep: (step: number) => void;
}

export default function ProblemConfiguratorStepper({ activeStep, goToStep }: ConfiguratorStepperProps) {
	const toast = useToast()

	return (
		<Stepper size='lg' index={activeStep}>
			{steps.map((step, index) => (
				<Step key={index} onClick={() => {
					if (index <= activeStep) {
						goToStep(index)
					} else {
						toast({
							title: 'Cannot proceed',
							description: 'You must complete the previous steps first',
							status: 'warning',
							duration: 3000,
							isClosable: true
						})
					}

				}}>
					<StepIndicator _hover={{
						cursor: 'pointer',
						bg: index <= activeStep ? 'gray.100' : 'white',
						transform: index <= activeStep ? 'scale(1.05)' : 'scale(1)',
						transition: 'all 0.2s'
					}}>
						<StepStatus
							complete={<StepIcon />}
							incomplete={<StepNumber />}
							active={<StepNumber />}
						/>
					</StepIndicator>

					<Box flexShrink='0' display={"block"}>
						<StepTitle>{step.title}</StepTitle>
						<StepDescription>{step.description}</StepDescription>
					</Box>

					<StepSeparator />
				</Step>
			))}
		</Stepper>
	)
}