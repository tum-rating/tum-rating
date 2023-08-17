import { PropsWithChildren } from 'react';
import {
  ActionIcon,
  Anchor,
  Box,
  Burger,
  Button,
  Center,
  createStyles,
  Divider,
  Drawer,
  Group,
  Header,
  rem,
  ScrollArea,
  useMantineColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconMoonStars, IconSun } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useUser } from '../auth/useUser';
import { UserButton } from '../components/UserButton';
import { openSignInModal, openSignUpModal } from '../components/Modals';

const useStyles = createStyles((theme) => ({
  link: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontWeight: 500,
    fontSize: theme.fontSizes.sm,

    [theme.fn.smallerThan('sm')]: {
      height: rem(42),
      display: 'flex',
      alignItems: 'center',
      width: '100%',
    },

    ...theme.fn.hover({
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    }),
  },

  subLink: {
    width: '100%',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    borderRadius: theme.radius.md,

    ...theme.fn.hover({
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
    }),

    '&:active': theme.activeStyles,
  },

  hiddenMobile: {
    [theme.fn.smallerThan('xs')]: {
      display: 'none',
    },
  },

  hiddenDesktop: {
    [theme.fn.largerThan('xs')]: {
      display: 'none',
    },
  },
  authModal: {
    '.mantine-Modal-header': {
      position: 'absolute',
      right: 0,
    },
  },
  logo: {
    position: 'relative',
    fontSize: '20px',
    textDecoration: 'none',
    letterSpacing: '.2px',
    display: 'flex',
    alignItems: 'flex-end',
    lineHeight: 0.8,

    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    '&:after': {
      content: "'🇩🇪'",
      display: 'block',
      position: 'absolute',
      top: '1px',
      right: '10px',
      fontSize: '19px',
    },
  },
}));

export const MainLayout = ({ children }: PropsWithChildren) => {
  const { user } = useUser();
  const { classes, theme } = useStyles();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  const { t } = useTranslation();
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);

  return (
    <Box h={'100%'}>
      <Header height={60} px="md">
        <Group position="apart" fw={600} sx={{ height: '100%' }}>
          <Anchor underline={false} href="/" className={classes.logo}>
            <svg width="60" height="27" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 73 38">
              <path d="M28 0v31h8V0h37v38h-7V7h-8v31h-7V7h-8v31H21V7h-7v31H7V7H0V0h28z" fill="currentColor"></path>
            </svg>
            ratIng
          </Anchor>
          <Group>
            {user ? null : (
              <>
                <Button compact onClick={openSignInModal} variant="default">
                  {t('login')}
                </Button>
                <Button compact onClick={openSignUpModal}>
                  {t('register')}
                </Button>
              </>
            )}
            <Group className={classes.hiddenMobile}>
              {user ? <UserButton {...user.user} /> : null}
              <ActionIcon
                variant="outline"
                color={dark ? 'yellow' : 'blue'}
                onClick={() => toggleColorScheme()}
                title="Toggle color scheme"
              >
                {dark ? <IconSun size="1.1rem" /> : <IconMoonStars size="1.1rem" />}
              </ActionIcon>
            </Group>
          </Group>
          <Burger opened={drawerOpened} onClick={toggleDrawer} className={classes.hiddenDesktop} />
        </Group>
      </Header>
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        className={classes.hiddenDesktop}
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(60)})`} mx="-md">
          <Divider my="sm" color={theme.colorScheme === 'dark' ? 'dark.5' : 'gray.1'} />
          <a href="#" className={classes.link}>
            Home
          </a>
          <Group position="center" grow pb="xl" px="md">
            <Button variant="default">{t('login')}</Button>
            <Button>{t('register')}</Button>
          </Group>
        </ScrollArea>
      </Drawer>
      <Center pb={25} h={'100%'}>
        {children}
      </Center>
    </Box>
  );
};
