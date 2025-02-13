import React, { useState, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { useMediaQuery } from '@mantine/hooks';
import { useMantineTheme, ActionIcon } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import classes from './Carousel.module.css';

interface CarouselProps {
  children: React.ReactNode;
}

const Carousel = ({ children }: CarouselProps) => {
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    slidesToScroll: mobile ? 1 : 2,
    align: 'start',
    containScroll: 'trimSnaps',
  });
  const [_, setActiveIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setActiveIndex(emblaApi.selectedScrollSnap());
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };
    emblaApi.on('select', onSelect);
    onSelect();
  }, [emblaApi]);

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  return (
    <div className={classes.carouselWrapper}>
      <div className={classes.prevButtonWrapper}>
        <ActionIcon
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          variant="light"
        >
          <IconChevronLeft />
        </ActionIcon>
      </div>
      <div className={classes.carousel} ref={emblaRef}>
        <div className={classes.carouselContainer}>{children}</div>
      </div>
      <div className={classes.nextButtonWrapper}>
        <ActionIcon
          onClick={scrollNext}
          disabled={!canScrollNext}
          variant="light"
        >
          <IconChevronRight />
        </ActionIcon>
      </div>
    </div>
  );
};

export { Carousel };