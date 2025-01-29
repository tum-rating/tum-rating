import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { useMediaQuery } from '@mantine/hooks';
import { useMantineTheme } from '@mantine/core';
import classes from './Carousel.module.css';

interface CarouselProps {
  children: React.ReactNode;
}

const Carousel = ({ children }: CarouselProps) => {
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const [emblaRef] = useEmblaCarousel({
    slidesToScroll: mobile ? 1 : 2,
    align: 'start',
    containScroll: 'trimSnaps',
  });

  return (
    <div className={classes.carousel} ref={emblaRef}>
      <div className={classes.carouselContainer}>{children}</div>
    </div>
  );
};

export { Carousel };