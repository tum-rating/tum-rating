import { PropsWithChildren, useEffect, useRef, useState, ReactNode } from "react";

type MasonryProps = PropsWithChildren<{
    children: ReactNode[] | null;
}>;

const Masonry = ({ children }: MasonryProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [columns, setColumns] = useState(1);

    useEffect(() => {
        const handleResize = () => {
            if (ref.current) {
                const width = ref.current.offsetWidth;
                if (width < 600) {
                    setColumns(1);
                } else if (width < 900) {
                    setColumns(2);
                } else if (width < 1200) {
                    setColumns(3);
                } else {
                    setColumns(4);
                }
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const columnWrapper: { [key: string]: ReactNode[] } = {};
    const result: ReactNode[] = [];

    for (let i = 0; i < columns; i++) {
        columnWrapper[`column${i}`] = [];
    }

    if (children) {
        for (let i = 0; i < children.length; i++) {
            const columnIndex = i % columns;
            columnWrapper[`column${columnIndex}`].push(
                <div key={i} className="mb-1">
                    {children[i]}
                </div>
            );
        }
    }

    for (let i = 0; i < columns; i++) {
        result.push(
            <div key={i} className="flex flex-col gap-2">
                {columnWrapper[`column${i}`]}
            </div>
        );
    }

    return (
        <div ref={ref} className="masonry w-full flex gap-2">
            {result.map((element)=> element)}
        </div>
    );
};

export default Masonry;
