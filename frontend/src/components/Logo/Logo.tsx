import {Anchor, Image, useMantineColorScheme} from '@mantine/core';

import logoDark from '@/assets/img/logo-dark.png';
import logo from '@/assets/img/logo.png';

interface LogoProps {
    alt?: string;
    width?: number;
    height?: number;
    href?: string;
}

export const Logo = ({alt = "tum-rating logo", width = 129, height = 28, href = "/"}: LogoProps) => {
    const {colorScheme} = useMantineColorScheme();
    const logoSrc = colorScheme === 'light' ? logo : logoDark;

    return (
        <Anchor href={href}>
            <Image fit="contain" height={height} width={width} src={logoSrc} alt={alt} style={{
                width: `${width}px`,
            }}/>
        </Anchor>
    );
};