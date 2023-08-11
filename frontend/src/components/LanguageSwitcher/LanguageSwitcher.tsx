import {useTranslation} from 'react-i18next';
import {createStyles, Image, Menu, rem, UnstyledButton} from "@mantine/core";
import {useEffect, useState} from "react";
import {IconChevronDown} from "@tabler/icons-react";


const data = [
    {label: 'English', code: "en-GB", image: `https://flagcdn.com/16x12/gb.png`},
    {label: 'Deutsch', code: "de-DE", image: `https://flagcdn.com/16x12/de.png`},
    {label: 'Polski', code: "pl-PL", image: `https://flagcdn.com/16x12/pl.png`},
];

const useStyles = createStyles((theme, {opened}: { opened: boolean }) => ({
    control: {
        width: rem(200),
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: `${theme.spacing.xs} ${theme.spacing.md}`,
        borderRadius: theme.radius.md,
        border: `${rem(1)} solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[2]
        }`,
        transition: 'background-color 150ms ease',
        backgroundColor:
            theme.colorScheme === 'dark'
                ? theme.colors.dark[opened ? 5 : 6]
                : opened
                    ? theme.colors.gray[0]
                    : theme.white,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
        },
    },

    label: {
        fontWeight: 500,
        fontSize: theme.fontSizes.sm,
    },

    icon: {
        transition: 'transform 150ms ease',
        transform: opened ? 'rotate(180deg)' : 'rotate(0deg)',
    },
}));


function LanguageSwitcher() {
    const {i18n} = useTranslation();
    const defaultLanguage = i18n.language;
    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };
    useEffect(() => {
        const language = data.find(x=>x.code === defaultLanguage)
        if(language){
            setSelected(language)
        }else{
            setSelected(data[0])
        }
    }, [defaultLanguage])

    const [opened, setOpened] = useState(false);
    const {classes} = useStyles({opened});
    const [selected, setSelected] = useState({});
    console.log(selected)
    const items = data.map((item) => (
        <Menu.Item
            icon={<Image src={item.image}/>}
            onClick={() => {
                changeLanguage(item.code)
            }}
            key={item.label}
        >
            {item.label}
        </Menu.Item>
    ));
    return (
        <Menu
            onOpen={() => setOpened(true)}
            onClose={() => setOpened(false)}
            radius="md"
            width="target"
            withinPortal
        >
            <Menu.Target>
                <UnstyledButton className={classes.control}>
                    <span className={classes.label}>{selected.label}</span>
                    <IconChevronDown size="1rem" className={classes.icon} stroke={1.5}/>
                </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>{items}</Menu.Dropdown>
        </Menu>

    );
}

export {LanguageSwitcher};