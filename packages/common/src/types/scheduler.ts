import { Explore, ExploreError } from './explore';
import { MetricQuery } from './metricQuery';

export type SchedulerCsvOptions = {
    formatted: boolean;
    limit: 'table' | 'all' | number;
};

export type SchedulerImageOptions = {
    withPdf?: boolean;
};

export type SchedulerGsheetsOptions = {
    gdriveId: string;
    gdriveName: string;
    gdriveOrganizationName: string;
    url: string;
};
export type SchedulerOptions =
    | SchedulerCsvOptions
    | SchedulerImageOptions
    | SchedulerGsheetsOptions;

export enum SchedulerJobStatus {
    SCHEDULED = 'scheduled',
    STARTED = 'started',
    COMPLETED = 'completed',
    ERROR = 'error',
}

export enum SchedulerFormat {
    CSV = 'csv',
    IMAGE = 'image',
    GSHEETS = 'gsheets',
}

export type SchedulerLog = {
    task:
        | 'handleScheduledDelivery'
        | 'sendEmailNotification'
        | 'sendSlackNotification'
        | 'uploadGsheets'
        | 'downloadCsv'
        | 'uploadGsheetFromQuery'
        | 'compileProject'
        | 'testAndCompileProject'
        | 'validateProject';
    schedulerUuid?: string;
    jobId: string;
    jobGroup?: string;
    scheduledTime: Date;
    createdAt: Date;
    status: SchedulerJobStatus;
    target?: string;
    targetType?: 'email' | 'slack' | 'gsheets';
    details?: Record<string, any>;
};

export type CreateSchedulerLog = Omit<SchedulerLog, 'createdAt'>;

export type SchedulerBase = {
    schedulerUuid: string;
    name: string;
    message?: string;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    format: SchedulerFormat;
    cron: string;
    savedChartUuid: string | null;
    dashboardUuid: string | null;
    options: SchedulerOptions;
};

export type ChartScheduler = SchedulerBase & {
    savedChartUuid: string;
    dashboardUuid: null;
};
export type DashboardScheduler = SchedulerBase & {
    savedChartUuid: null;
    dashboardUuid: string;
};

export type Scheduler = ChartScheduler | DashboardScheduler;

export type SchedulerAndTargets = Scheduler & {
    targets: (SchedulerSlackTarget | SchedulerEmailTarget)[];
};

export type SchedulerSlackTarget = {
    schedulerSlackTargetUuid: string;
    createdAt: Date;
    updatedAt: Date;
    schedulerUuid: string;
    channel: string;
};

export type SchedulerEmailTarget = {
    schedulerEmailTargetUuid: string;
    createdAt: Date;
    updatedAt: Date;
    schedulerUuid: string;
    recipient: string;
};

export type CreateSchedulerTarget =
    | Pick<SchedulerSlackTarget, 'channel'>
    | Pick<SchedulerEmailTarget, 'recipient'>;

export const getSchedulerTargetUuid = (
    target: SchedulerSlackTarget | SchedulerEmailTarget | CreateSchedulerTarget,
): string | undefined => {
    if ('schedulerSlackTargetUuid' in target) {
        return target.schedulerSlackTargetUuid;
    }
    if ('schedulerEmailTargetUuid' in target) {
        return target.schedulerEmailTargetUuid;
    }
    return undefined;
};

export type UpdateSchedulerSlackTarget = Pick<
    SchedulerSlackTarget,
    'schedulerSlackTargetUuid' | 'channel'
>;

export type UpdateSchedulerEmailTarget = Pick<
    SchedulerEmailTarget,
    'schedulerEmailTargetUuid' | 'recipient'
>;

export type CreateSchedulerAndTargets = Omit<
    Scheduler,
    'schedulerUuid' | 'createdAt' | 'updatedAt'
> & {
    targets: CreateSchedulerTarget[];
};

export type CreateSchedulerAndTargetsWithoutIds = Omit<
    CreateSchedulerAndTargets,
    'savedChartUuid' | 'dashboardUuid' | 'createdBy'
>;

export type UpdateSchedulerAndTargets = Pick<
    Scheduler,
    'schedulerUuid' | 'name' | 'message' | 'cron' | 'format' | 'options'
> & {
    targets: Array<
        | CreateSchedulerTarget
        | UpdateSchedulerSlackTarget
        | UpdateSchedulerEmailTarget
    >;
};

export type UpdateSchedulerAndTargetsWithoutId = Omit<
    UpdateSchedulerAndTargets,
    'schedulerUuid'
>;

export const isUpdateSchedulerSlackTarget = (
    data: CreateSchedulerTarget | UpdateSchedulerSlackTarget,
): data is UpdateSchedulerSlackTarget =>
    'schedulerSlackTargetUuid' in data && !!data.schedulerSlackTargetUuid;

export const isUpdateSchedulerEmailTarget = (
    data: CreateSchedulerTarget | UpdateSchedulerEmailTarget,
): data is UpdateSchedulerEmailTarget =>
    'schedulerEmailTargetUuid' in data && !!data.schedulerEmailTargetUuid;

export const isChartScheduler = (data: Scheduler): data is ChartScheduler =>
    'savedChartUuid' in data && !!data.savedChartUuid;

export const isSlackTarget = (
    target: SchedulerSlackTarget | SchedulerEmailTarget,
): target is SchedulerSlackTarget => 'channel' in target;

export const isEmailTarget = (
    target: SchedulerSlackTarget | SchedulerEmailTarget,
): target is SchedulerEmailTarget => !isSlackTarget(target);

export const isCreateSchedulerSlackTarget = (
    target:
        | Pick<SchedulerSlackTarget, 'channel'>
        | Pick<SchedulerEmailTarget, 'recipient'>,
): target is Pick<SchedulerSlackTarget, 'channel'> => 'channel' in target;

export const isSchedulerCsvOptions = (
    options:
        | SchedulerCsvOptions
        | SchedulerImageOptions
        | SchedulerGsheetsOptions,
): options is SchedulerCsvOptions => options && 'limit' in options;

export const isSchedulerImageOptions = (
    options:
        | SchedulerCsvOptions
        | SchedulerImageOptions
        | SchedulerGsheetsOptions,
): options is SchedulerImageOptions => options && 'withPdf' in options;

export const isSchedulerGsheetsOptions = (
    options:
        | SchedulerCsvOptions
        | SchedulerImageOptions
        | SchedulerGsheetsOptions,
): options is SchedulerGsheetsOptions => options && 'gdriveId' in options;

export type ApiSchedulerAndTargetsResponse = {
    status: 'ok';
    results: SchedulerAndTargets;
};

export type SchedulerWithLogs = {
    schedulers: SchedulerAndTargets[];
    users: { firstName: string; lastName: string; userUuid: string }[];
    charts: { name: string; savedChartUuid: string }[];
    dashboards: { name: string; dashboardUuid: string }[];
    logs: SchedulerLog[];
};

export type ScheduledJobs = {
    date: Date;
    id: string;
};
export type ApiScheduledJobsResponse = {
    status: 'ok';
    results: ScheduledJobs[];
};

export type ApiSchedulerLogsResponse = {
    status: 'ok';
    results: SchedulerWithLogs;
};
export type ApiTestSchedulerResponse = {
    status: 'ok';
};

// Scheduler task types
export type ScheduledDeliveryPayload =
    | { schedulerUuid: string }
    | CreateSchedulerAndTargets;
export const isCreateScheduler = (
    data: ScheduledDeliveryPayload,
): data is CreateSchedulerAndTargets => 'targets' in data;
export const getSchedulerUuid = (
    data: ScheduledDeliveryPayload,
): string | undefined =>
    isCreateScheduler(data) ? undefined : data.schedulerUuid;

export enum LightdashPage {
    DASHBOARD = 'dashboard',
    CHART = 'chart',
    EXPLORE = 'explore',
}

export type NotificationPayloadBase = {
    schedulerUuid?: string;
    scheduledTime: Date;
    jobGroup: string;
    page: {
        url: string;
        details: {
            name: string;
            description: string | undefined;
        };
        pageType: LightdashPage;
        organizationUuid: string;
        imageUrl?: string;
        csvUrl?: {
            path: string;
            filename: string;
            localPath: string;
            truncated: boolean;
        };
        csvUrls?: {
            path: string;
            filename: string;
            localPath: string;
            truncated: boolean;
        }[];
        pdfFile?: string;
    };
    scheduler: CreateSchedulerAndTargets;
};

export type SlackNotificationPayload = NotificationPayloadBase & {
    schedulerSlackTargetUuid?: string;
    channel: string;
};

export type EmailNotificationPayload = NotificationPayloadBase & {
    schedulerEmailTargetUuid?: string;
    recipient: string;
};

export type GsheetsNotificationPayload = {
    schedulerUuid: string;
    scheduledTime: Date;
    jobGroup: string;
};

export type DownloadCsvPayload = {
    userUuid: string;
    projectUuid: string;
    exploreId: string;
    metricQuery: MetricQuery;
    onlyRaw: boolean;
    csvLimit: number | null | undefined;
    showTableNames: boolean;
    columnOrder: string[];
    customLabels: Record<string, string> | undefined;
};

export type ApiCsvUrlResponse = {
    status: 'ok';
    results: {
        url: string;
        status: string;
        truncated: boolean;
    };
};

export type CompileProjectPayload = {
    createdByUserUuid: string;
    organizationUuid: string;
    projectUuid: string;
    requestMethod: string;
    jobUuid: string;
};

export type ValidateProjectPayload = {
    projectUuid: string;
    context: 'lightdash_app' | 'dbt_refresh' | 'test_and_compile' | 'cli';
    userUuid: string;
    organizationUuid: string | undefined;
    explores?: (Explore | ExploreError)[];
};

export type ApiJobScheduledResponse = {
    status: 'ok';
    results: {
        jobId: string;
    };
};

export type ApiJobStatusResponse = {
    status: 'ok';
    results: {
        status: string;
    };
};
