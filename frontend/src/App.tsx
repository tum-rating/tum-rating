import {ColorScheme, ColorSchemeProvider, MantineProvider} from "@mantine/core";
import {RoutesApp} from "./routes";
import {useState} from "react";



function App() {
    const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
    const toggleColorScheme = (value?: ColorScheme) =>
        setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
    return (
        <ColorSchemeProvider
            colorScheme={colorScheme}
            toggleColorScheme={toggleColorScheme}
        >
            <MantineProvider
                theme={{
                    colorScheme
                }}
                withGlobalStyles
                withNormalizeCSS
            >
                <RoutesApp/>
            </MantineProvider>
        </ColorSchemeProvider>
    );
}

export default App;
