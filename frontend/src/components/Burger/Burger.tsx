import { ActionIcon, ThemeIcon } from '@mantine/core';
import clsx from 'clsx';

import classes from './Burger.module.css';

interface BurgerProps {
    open: boolean;
    toggle: () => void;
}

const Burger = (props: BurgerProps) => {
    const { open, toggle } = props;
    return (
        <ActionIcon
            variant="light"
            onClick={() => {
                toggle()
            }}
        >
            <ThemeIcon variant="light" >
                <svg className={clsx(classes.burger, open && classes.active)} viewBox="0 0 100 100" width="80">
                    <path className={clsx(classes.line, 'top')} d="m 30,33 h 40 c 3.722839,0 7.5,3.126468 7.5,8.578427 0,5.451959 -2.727029,8.421573 -7.5,8.421573 h -20" />
                    <path className={clsx(classes.line, 'middle')} d="m 30,50 h 40" />
                    <path className={clsx(classes.line, 'bottom')} d="m 70,67 h -40 c 0,0 -7.5,-0.802118 -7.5,-8.365747 0,-7.563629 7.5,-8.634253 7.5,-8.634253 h 20" />
                </svg>
            </ThemeIcon>
        </ActionIcon>
    );
};

export { Burger };
