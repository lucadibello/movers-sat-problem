import * as React from "react";
import { Box, Heading, Grid } from "@chakra-ui/react";
import { ColorModeSwitcher } from "./components/ColorModeSwitcher";
import { Providers } from "./providers/providers";
import { ProblemConfigurator } from "./components/ProblemConfigurator";
import { solve } from "services";

export const App = () => (
    <Providers>
        <Box as="main" textAlign="center" fontSize="xl">
            <Grid minH="100vh" p={3}>
                {/* Theme switcher on top of the screen */}
                <ColorModeSwitcher justifySelf="flex-end" />
                <Heading>Movers SAT Solver</Heading>

                {/* Problem configurator */}
                <ProblemConfigurator
                    onSubmit={(data) => {
                        console.log("Submitted", data);

                        // send request to the backend using service
                        solve(data.n_floors, data.n_movers, data.max_t, [])
                            .then((result) => {
                                console.log("Result:", result);
                            })
                            .catch((error) => {
                                console.error("Error:", error);
                            })
                    }}
                />
            </Grid>
        </Box>
    </Providers>
);
