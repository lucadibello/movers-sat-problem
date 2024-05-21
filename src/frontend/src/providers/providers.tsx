import { MoversProvider } from "contexts/MoverContext";
import { theme } from "../util/theme";
import { ChakraProvider } from "@chakra-ui/react";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ChakraProvider theme={theme}>
			<MoversProvider>
				{children}
			</MoversProvider>
		</ChakraProvider>
	);
}
