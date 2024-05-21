interface ElementStepperProps {
	activeStep: number;
	elements: JSX.Element[]
}

export default function ElementStepper({ activeStep, elements }: ElementStepperProps) {
	// If the active step is greater than the number of elements, throw an error
	if (activeStep >= elements.length) throw new Error("Invalid active step");
	// Otherwise, return the element at the active step
	return elements[activeStep];
}