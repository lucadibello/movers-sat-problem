import { Button, FormControl, FormErrorMessage, FormLabel, Input, VStack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";

interface FormData {
	n_floors: number;
	n_movers: number;
	max_t: number;
}

interface ProblemConfiguratorProps {
	onSubmit: (data: FormData) => void;
	onValidationError?: (message: string) => void;
}

export function ProblemConfigurator({
	onSubmit,
}: ProblemConfiguratorProps) {
	const {
		handleSubmit,
		register,
		formState: { errors, isSubmitting },
	} = useForm<FormData>({
		defaultValues: {
			n_floors: 3,
			n_movers: 3,
			max_t: 10,
		},
		reValidateMode: 'onBlur',
	});

	return (
		<form onSubmit={handleSubmit(onSubmit)} style={{
			"height": "100%",
			"width": "100%",
		}}>
			<VStack gap={4} w="full">
				{/* Number of floors */}
				<FormControl isInvalid={Boolean(errors.n_floors)}>
					<FormLabel htmlFor='name'>Number of Floors</FormLabel>
					<Input
						id='n_floors'
						placeholder='i.e. 3'
						type="number"
						{...register('n_floors', {
							required: 'This field is required',
							min: { value: 1, message: 'The minimum value is 1' },
							max: { value: 100, message: 'The maximum value is 100' },
						})}
					/>
					<FormErrorMessage>
						{errors.n_floors && errors.n_floors.message}
					</FormErrorMessage>
				</FormControl>

				{/* Number of movers */}
				<FormControl isInvalid={Boolean(errors.n_movers)}>
					<FormLabel htmlFor='name'>Number of Movers</FormLabel>
					<Input
						id='n_movers'
						placeholder='i.e. 3'
						type="number"
						{...register('n_movers', {
							required: 'This field is required',
							min: { value: 1, message: 'The minimum value is 1' },
							max: { value: 100, message: 'The maximum value is 100' },
						})}
					/>
					<FormErrorMessage>
						{errors.n_movers && errors.n_movers.message}
					</FormErrorMessage>
				</FormControl>

				{/* Max time */}
				<FormControl isInvalid={Boolean(errors.max_t)}>
					<FormLabel htmlFor='name'>Maximum number of time steps</FormLabel>
					<Input
						id='max_t'
						placeholder='i.e. 3'
						type="number"
						{...register('max_t', {
							required: 'This field is required',
							min: { value: 1, message: 'The minimum value is 1' },
							max: { value: 100, message: 'The maximum value is 100' },
						})}
					/>
					<FormErrorMessage>
						{errors.max_t && errors.max_t.message}
					</FormErrorMessage>
				</FormControl>

				<Button mt={4} colorScheme='teal' isLoading={isSubmitting} type='submit'>
					Next
				</Button>
			</VStack>
		</form>
	)
}
