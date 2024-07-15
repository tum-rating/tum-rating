
import fs from "fs";
import {fetchAllPages, summariesFn,fetchSemestersList} from "./utils.js";


const semesterId = 200;


fetchSemestersList();
// fetchAllPages({semesterId}).then((courses) => {
//     summariesFn(courses).then((summaries)=>{
//         fs.writeFile("output.json", JSON.stringify(summaries), "utf8", (writeErr) => {
//             if (writeErr) {
//                 console.error("Error writing JSON to file:", writeErr);
//             } else {
//                 console.log("JSON data saved to output.json");
//             }
//         });
//     });
// });



