import {cn} from "@/lib/utils.ts";

interface DistanceLabelProps {
    distance: number;
}

const DistanceLabel = ({distance}: DistanceLabelProps) => {


    let distanceLabel = "unknown";
    let color = "gray";

    if (distance === 0) {
        distanceLabel = "exact match"
        color = 'text-blue-500'
    } else if (distance > 0 && distance <= 10) {
        distanceLabel = "close match"
        color = 'text-blue-500'
    } else if (distance > 10 && distance <= 16) {
        distanceLabel = "medium match"
        color = 'text-yellow-500'
    } else if (distance > 16) {
        distanceLabel = "far match"
        color = 'text-red-500'
    }


    return (
        <div className='flex gap-1'>
            <p className={cn(`text-xs font-bold ${color}`)}>
                <span className="text-[16px] inline-block mr-1">
                    {distance}
                </span>
                {distanceLabel}
            </p>
        </div>
    )
}

export default DistanceLabel;