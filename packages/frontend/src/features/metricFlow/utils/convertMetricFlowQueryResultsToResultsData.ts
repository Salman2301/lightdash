import { ApiQueryResults, Explore, Field, getItemId } from '@lightdash/common';
import { MetricFlowJsonResults } from '../../../api/MetricFlowAPI';

export default function convertMetricFlowQueryResultsToResultsData(
    explore: Explore,
    metricFlowJsonResults: MetricFlowJsonResults,
) {
    const dimensionIdsInSchema = metricFlowJsonResults.schema.fields.map(
        ({ name }) => name,
    );
    const metricIdsInSchema = metricFlowJsonResults.schema.fields.map(
        ({ name }) => name,
    );

    const dimensionsInSchema = Object.values(
        explore.tables[explore.baseTable].dimensions,
    ).filter((dimension) => dimensionIdsInSchema.includes(dimension.name));
    const metricsInSchema = Object.values(
        explore.tables[explore.baseTable].metrics,
    ).filter((metric) => metricIdsInSchema.includes(metric.name));

    const resultsData: ApiQueryResults = {
        metricQuery: {
            dimensions: dimensionsInSchema.map(getItemId),
            metrics: metricsInSchema.map(getItemId),
            filters: {},
            sorts: [],
            limit: 0,
            tableCalculations: [],
        },
        rows: metricFlowJsonResults.data.map((row) =>
            Object.keys(row).reduce((acc, columnName) => {
                const raw = row[columnName];
                return {
                    ...acc,
                    [`${explore.baseTable}_${columnName}`]: {
                        value: {
                            raw,
                            formatted: `${raw}`,
                        },
                    },
                };
            }, {}),
        ),
    };

    return {
        resultsData,
        fieldsMap: [...dimensionsInSchema, ...metricsInSchema].reduce<
            Record<string, Field>
        >(
            (acc, field) => ({
                ...acc,
                [getItemId(field)]: field,
            }),
            {},
        ),
    };
}
