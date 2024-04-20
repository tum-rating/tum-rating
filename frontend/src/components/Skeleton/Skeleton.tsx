import { MantineComponent, Skeleton as SkeletonLoader, SkeletonProps as SkeletonLoaderProps } from '@mantine/core';
import { forwardRef } from 'react';

interface SkeletonProps extends SkeletonLoaderProps {
    loading: boolean;
    component: MantineComponent<any>;
}

const Skeleton = forwardRef((props: SkeletonProps, ref) => {
    const { loading, component: Component, ...rest } = props;

    if (loading) {
        return <SkeletonLoader {...rest} />;
    }
    if (typeof Component === 'function') {
        return <Component ref={ref} />;
    }
    return Component;
});

export { Skeleton };
