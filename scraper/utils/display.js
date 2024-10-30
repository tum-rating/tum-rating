import figlet from 'figlet';
import chalk from 'chalk';
import prompt from 'prompts';

const displayHeader = async () => {
    try {
        console.log(
            chalk.magenta(
                await figlet.text("TUM - RATING", {
                    font: "Standard",
                    horizontalLayout: "default",
                    verticalLayout: "default",
                    width: 70,
                    whitespaceBreak: true,
                })
            ), chalk.cyan(
                await figlet.text("scraper", {
                    font: "Standard",
                    horizontalLayout: "default",
                    verticalLayout: "default",
                    width: 80,
                    whitespaceBreak: true,
                })
            )
        );
    } catch (err) {
        console.log("Something went wrong...");
        console.dir(err);
    }
};


export { displayHeader };