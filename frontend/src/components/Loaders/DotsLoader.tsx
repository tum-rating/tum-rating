import {ComponentPropsWithoutRef} from "react";

import classes from "@/components/Loaders/RouteLoader.module.css";

const DotsLoader = (props:ComponentPropsWithoutRef<any>) =>{
    return (
        <div {...props} className={classes.loader}>
            {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className={classes.dot}></div>
            ))}
        </div>
    )
}

export {DotsLoader}