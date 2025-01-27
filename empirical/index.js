"use strict";

import * as fs from "fs";
import {
    prefilter,
    parseUrls,
    throwAway
} from "./lib/clean.js";
import { classify } from "./lib/classify.js";
import { rankLibUsage } from "./lib/libUsage.js";
import {
    makeTable2Html,
    makeTable3Html,
    makeTable4Html,
    makeLibUsageRankingListHtml,
    makeStatsHtml,
    fillReport
} from "./lib/report.js";
import LineByLine from "n-readlines";

function readAllLinesFromFile(filename) {
    const data = [];
    const lineReader = new LineByLine(filename);
    let lineBuffer;
    while (lineBuffer = lineReader.next()) {
        const line = lineBuffer.toString();
        if (line) data.push(line);
    }
    return data;
}

function readDataFromFile(filename) {
    return readAllLinesFromFile(filename)
        .map(line => JSON.parse(line));
}

(() => {

    if (process.argv.length !== 3) {
        console.log(`Usage: ${process.argv[0]} ${process.argv[1]} <wkdir>`);
        return;
    }

    const wkdir = process.argv[2];

    const data =
        parseUrls(
            prefilter(
                readDataFromFile(wkdir + "/output.txt")
            ));
    const classified = classify(data);
    const dataTA = throwAway(data);
    const classifiedTA = classify(dataTA);

    const table2Html = makeTable2Html(classified);
    const table3Html = makeTable3Html(classifiedTA);
    const table4Html = makeTable4Html(classifiedTA);

    const libUsageRankingList = rankLibUsage(data);
    const libUsageRankingListHtml = makeLibUsageRankingListHtml(libUsageRankingList);

    const statsHtml = makeStatsHtml(data, dataTA);

    const report = fillReport(statsHtml, table2Html, table3Html, table4Html, libUsageRankingListHtml);
    fs.writeFileSync(wkdir + "/report.html", report);

})();
