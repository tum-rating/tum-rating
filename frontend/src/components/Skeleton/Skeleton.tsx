import { Skeleton as SkeletonLoader, SkeletonProps as SkeletonLoaderProps } from '@mantine/core';
import { ReactNode } from 'react';



interface SkeletonProps extends SkeletonLoaderProps {
    loading: boolean;
    component: ReactNode;
}

const Skeleton = (props: SkeletonProps) => {
    const { loading, component: Component, ...rest } = props;
    if (loading) {
        return <SkeletonLoader {...rest} />;
    }
    return Component;
};

export { Skeleton };
