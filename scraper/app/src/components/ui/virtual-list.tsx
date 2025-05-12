import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
import { FetchedComputedCourse } from "@/types/fetchedData";

interface VirtualListProps {
    data: FetchedComputedCourse[];
    renderer: (row: FetchedComputedCourse, searchTerm: string) => JSX.Element;
    height: string | number;
    searchTerm: string;
    width?: string | number;
}

const VirtualList = ({ data, renderer, height, searchTerm,width }: VirtualListProps) => {
    const parentRef = useRef<HTMLDivElement>(null);

    const count = data.length;

    const virtualizer = useVirtualizer({
        count,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 45,
    });

    const items = virtualizer.getVirtualItems();

    return (
        <div>
            <div
                ref={parentRef}
                className="List"
                style={{
                    width: width || 400,
                    height: height,
                    overflowY: 'auto',
                    contain: 'strict',
                }}
            >
                <div
                    style={{
                        height: virtualizer.getTotalSize(),
                        width: '100%',
                        position: 'relative',
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            transform: `translateY(${items[0]?.start ?? 0}px)`,
                        }}
                    >
                        {items.map((virtualRow) => (
                            <div
                                key={virtualRow.key}
                                data-index={virtualRow.index}
                                ref={virtualizer.measureElement}
                                className={virtualRow.index % 2 ? 'ListItemOdd' : 'ListItemEven'}
                            >
                                {renderer(data[virtualRow.index], searchTerm)}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VirtualList;