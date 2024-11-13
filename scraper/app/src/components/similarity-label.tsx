import {cn} from "@/lib/utils.ts";

interface SimilarityLabelProps {
    similarity: number;
}

const SimilarityLabel = ({similarity}: SimilarityLabelProps) => {
    console.log(similarity)
    const {label, color} = getLabelAndColor(similarity);

    return (
        <div className='flex gap-1'>
            <p className={cn(`text-xs font-bold ${color}`)}>
                <span className="text-[16px] inline-block mr-1">
                    {similarity}
                </span>
                {label}
            </p>
        </div>
    );
};

const getLabelAndColor = (similarity: number) => {
    if (similarity === 0) return {label: "exact match", color: 'text-blue-500'};
    if (similarity <= 10) return {label: "close match", color: 'text-blue-500'};
    if (similarity <= 16) return {label: "medium match", color: 'text-yellow-500'};
    return {label: "far match", color: 'text-red-500'};
};

export default SimilarityLabel;
