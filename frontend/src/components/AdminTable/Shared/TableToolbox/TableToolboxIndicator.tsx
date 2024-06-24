import { Indicator, IndicatorProps } from '@mantine/core';

interface TableToolboxIndicatorProps extends IndicatorProps {}

const TableToolboxIndicator = (props: TableToolboxIndicatorProps) => {
    const { children, ...rest } = props;
    return (
        <Indicator withBorder size={12} offset={2} {...rest}>
            {children}
        </Indicator>
    );
};

export { TableToolboxIndicator };
