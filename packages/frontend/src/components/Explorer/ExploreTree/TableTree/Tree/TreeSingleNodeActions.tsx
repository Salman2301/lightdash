import {
    AdditionalMetric,
    Dimension,
    DimensionType,
    fieldId,
    friendlyName,
    isAdditionalMetric,
    isDimension,
    isField,
    isFilterableField,
    Metric,
    MetricType,
} from '@lightdash/common';
import { ActionIcon, Box, Menu, MenuProps, Tooltip } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import {
    IconChevronRight,
    IconDots,
    IconEdit,
    IconFilter,
    IconSparkles,
    IconTrash,
} from '@tabler/icons-react';
import { FC, useMemo } from 'react';
import { useFilters } from '../../../../../hooks/useFilters';
import { useExplorerContext } from '../../../../../providers/ExplorerProvider';
import { useTracking } from '../../../../../providers/TrackingProvider';
import { EventName } from '../../../../../types/Events';
import MantineIcon from '../../../../common/MantineIcon';

const getCustomMetricType = (type: DimensionType): MetricType[] => {
    switch (type) {
        case DimensionType.STRING:
        case DimensionType.TIMESTAMP:
        case DimensionType.DATE:
            return [
                MetricType.COUNT_DISTINCT,
                MetricType.COUNT,
                MetricType.MIN,
                MetricType.MAX,
            ];

        case DimensionType.NUMBER:
            return [
                MetricType.MIN,
                MetricType.MAX,
                MetricType.SUM,
                MetricType.PERCENTILE,
                MetricType.MEDIAN,
                MetricType.AVERAGE,
                MetricType.COUNT_DISTINCT,
                MetricType.COUNT,
            ];
        case DimensionType.BOOLEAN:
            return [MetricType.COUNT_DISTINCT, MetricType.COUNT];
        default:
            return [];
    }
};

type Props = {
    item: Metric | Dimension | AdditionalMetric;
    isHovered: boolean;
    isSelected: boolean;
    isOpened: MenuProps['opened'];
    onMenuChange: MenuProps['onChange'];
};

const TreeSingleNodeActions: FC<Props> = ({
    item,
    isHovered,
    isSelected,
    isOpened,
    onMenuChange,
}) => {
    const { addFilter } = useFilters();
    const { track } = useTracking();

    const removeAdditionalMetric = useExplorerContext(
        (context) => context.actions.removeAdditionalMetric,
    );

    const toggleAdditionalMetricModal = useExplorerContext(
        (context) => context.actions.toggleAdditionalMetricModal,
    );

    const [customMetricsMenuItemBgColor, toggle] = useToggle([
        'default',
        'gray.1',
    ]);

    const customMetrics = useMemo(
        () => (isDimension(item) ? getCustomMetricType(item.type) : []),
        [item],
    );

    return isHovered || isSelected || isOpened ? (
        <Menu
            withArrow
            withinPortal
            shadow="lg"
            position="bottom-end"
            arrowOffset={12}
            offset={-4}
            opened={isOpened}
            onChange={onMenuChange}
        >
            <Menu.Dropdown>
                {isField(item) && isFilterableField(item) ? (
                    <Menu.Item
                        component="button"
                        icon={<MantineIcon icon={IconFilter} />}
                        onClick={(e) => {
                            e.stopPropagation();

                            track({
                                name: EventName.ADD_FILTER_CLICKED,
                            });
                            addFilter(item, undefined);
                        }}
                    >
                        Add filter
                    </Menu.Item>
                ) : null}

                {isAdditionalMetric(item) ? (
                    <>
                        <Menu.Item
                            component="button"
                            icon={<MantineIcon icon={IconEdit} />}
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleAdditionalMetricModal({
                                    type: item.type,
                                    item,
                                    isEditing: true,
                                });
                            }}
                        >
                            Edit custom metric
                        </Menu.Item>
                        <Menu.Item
                            color="red"
                            key="custommetric"
                            component="button"
                            icon={<MantineIcon icon={IconTrash} />}
                            onClick={(e) => {
                                e.stopPropagation();

                                track({
                                    name: EventName.REMOVE_CUSTOM_METRIC_CLICKED,
                                });
                                removeAdditionalMetric(fieldId(item));
                            }}
                        >
                            Remove custom metric
                        </Menu.Item>
                    </>
                ) : null}

                {customMetrics.length > 0 && isDimension(item) ? (
                    <>
                        <Menu
                            withinPortal
                            trigger="hover"
                            position="right-start"
                            shadow="md"
                            closeOnItemClick
                            onOpen={() => toggle()}
                            onClose={() => toggle()}
                        >
                            <Menu.Target>
                                <Menu.Item
                                    bg={customMetricsMenuItemBgColor}
                                    component="button"
                                    role="menuitem"
                                    icon={<MantineIcon icon={IconSparkles} />}
                                    rightSection={
                                        <Box ml="xs">
                                            <MantineIcon
                                                icon={IconChevronRight}
                                            />
                                        </Box>
                                    }
                                >
                                    Add custom metrics
                                </Menu.Item>
                            </Menu.Target>

                            <Menu.Dropdown>
                                {customMetrics.map((metric) => (
                                    <Menu.Item
                                        key={metric}
                                        component="button"
                                        onClick={(e) => {
                                            e.stopPropagation();

                                            track({
                                                name: EventName.ADD_CUSTOM_METRIC_CLICKED,
                                            });
                                            toggleAdditionalMetricModal({
                                                type: metric,
                                                item,
                                                isEditing: false,
                                            });
                                        }}
                                    >
                                        {friendlyName(metric)}
                                    </Menu.Item>
                                ))}
                            </Menu.Dropdown>
                        </Menu>
                    </>
                ) : null}
            </Menu.Dropdown>

            {/* prevents bubbling of click event to NavLink */}
            <Box
                component="div"
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                }}
            >
                <Menu.Target>
                    <Tooltip
                        openDelay={500}
                        position="top"
                        label="View options"
                        disabled={isOpened}
                    >
                        <ActionIcon variant="transparent">
                            <MantineIcon
                                icon={IconDots}
                                color={isOpened ? 'black' : undefined}
                            />
                        </ActionIcon>
                    </Tooltip>
                </Menu.Target>
            </Box>
        </Menu>
    ) : (
        <Box w={28} />
    );
};

export default TreeSingleNodeActions;
