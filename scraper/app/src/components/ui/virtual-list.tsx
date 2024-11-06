import {useVirtualizer} from "@tanstack/react-virtual";
import {useRef} from "react";
import {FetchedComputedCourse} from "@/types/fetchedData.ts";

interface VirtualListProps {
    data: FetchedComputedCourse[],
    renderer: (row: FetchedComputedCourse) => JSX.Element
}

const VirtualList = ({data, renderer}: VirtualListProps) => {
    const parentRef = useRef<HTMLDivElement>(null)
    console.log(data)

    const count = data.length

    const virtualizer = useVirtualizer({
        count,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 45,
    })

    const items = virtualizer.getVirtualItems()

    return (
        <div>
            <div
                ref={parentRef}
                className="List"
                style={{
                    height: '100vh',
                    width: 400,
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
                        {
                            items.map((virtualRow) => {
                                    return (<div
                                            key={virtualRow.key}
                                            data-index={virtualRow.index}
                                            ref={virtualizer.measureElement}
                                            className={
                                                virtualRow.index % 2 ? 'ListItemOdd' : 'ListItemEven'
                                            }
                                        >
                                            {renderer(data[virtualRow.index])}
                                        </div>
                                    )
                                }
                            )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VirtualList;