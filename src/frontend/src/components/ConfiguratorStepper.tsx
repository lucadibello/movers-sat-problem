import { Box, Step, StepDescription, StepIcon, StepIndicator, StepNumber, StepSeparator, StepStatus, StepTitle, Stepper } from "@chakra-ui/react";

const steps = [
	{ title: 'Definition', description: 'Define the problem' },
	{ title: 'Setup', description: 'Arrange forniture' },
]

interface ConfiguratorStepperProps {
	activeStep: number;
}

export default function ProblemConfiguratorStepper({ activeStep }: ConfiguratorStepperProps) {
	return (
		<Stepper size='lg' index={activeStep}>
			{steps.map((step, index) => (
				<Step key={index}>
					<StepIndicator>
						<StepStatus
							complete={<StepIcon />}
							incomplete={<StepNumber />}
							active={<StepNumber />}
						/>
					</StepIndicator>

					<Box flexShrink='0'>
						<StepTitle>{step.title}</StepTitle>
						<StepDescription>{step.description}</StepDescription>
					</Box>

					<StepSeparator />
				</Step>
			))}
		</Stepper>
	)
}