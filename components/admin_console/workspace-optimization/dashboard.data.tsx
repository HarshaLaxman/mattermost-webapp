// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {useIntl} from 'react-intl';

import EasyManagementSvg from 'components/common/svg_images_components/easy_management_svg';
import DataPrivacySvg from 'components/common/svg_images_components/data_privacy_svg';
import SecuritySvg from 'components/common/svg_images_components/security_svg';
import ConfigurationSvg from 'components/common/svg_images_components/configuration_svg';
import PerformanceSvg from 'components/common/svg_images_components/performance_svg';
import UpdatesAndErrorsSvg from 'components/common/svg_images_components/updates_and_errors_svg';
import WorkspaceAccessSvg from 'components/common/svg_images_components/workspace_access_svg';

type DataModel = {
    [key: string]: {
        title: string;
        description: string;
        items: ItemModel[];
        icon: React.ReactNode;
    };
}

type ItemStatus = 'none' | 'ok' | 'info' | 'warning' | 'error';

type ItemModel = {
    id: string;
    title: string;
    description: string;
    configUrl: string;
    infoUrl: string;
    status: ItemStatus;
}

const getTranslationId = (key: string) => `admin.reporting.workspace_optimization.${key}`;

type UpdatesParam = {
    serverVersion: {
        version: string;
        type: string;
        status: ItemStatus;
    };
}

const useMetricsData = () => {
    const {formatMessage} = useIntl();

    const getUpdatesData = (data: UpdatesParam) => ({
        title: formatMessage({id: getTranslationId('updates.title'), defaultMessage: 'Updates and Errors'}),
        description: formatMessage({id: getTranslationId('updates.description'), defaultMessage: 'You have an update to consider'}),
        icon: (
            <UpdatesAndErrorsSvg
                width={22}
                height={22}
            />
        ),
        items: [
            {
                id: 'server_version',
                title: data.serverVersion.status === 'ok' ? formatMessage({
                    id: getTranslationId('updates.server_version.status.ok.title'),
                    defaultMessage: 'Your Mattermost server is running the latest version',
                }) : formatMessage({
                    id: getTranslationId('updates.server_version.status.error.title'),
                    defaultMessage: '{type} version update available',
                }, {type: data.serverVersion.type}),
                description: data.serverVersion.status === 'ok' ? formatMessage({
                    id: getTranslationId('updates.server_version.status.ok.description'),
                    defaultMessage: 'Placeholder: Nothing to do here. All good!',
                }) : formatMessage({
                    id: getTranslationId('updates.server_version.status.error.description'),
                    defaultMessage: 'Placeholder: Mattermost {version} contains a medium level security fix. Upgrading to this release is recommended.',
                }, {version: data.serverVersion.version}),
                configUrl: '#',
                infoUrl: '#',
                status: data.serverVersion.status,
            },
        ],
    });

    type ConfigurationParam = {
        ssl: {
            status: ItemStatus;
        };
        sessionLength: {
            status: ItemStatus;
        };
    }

    const getConfigurationData = (data: ConfigurationParam) => ({
        title: formatMessage({id: getTranslationId('configuration.title'), defaultMessage: 'Configuration'}),
        description: formatMessage({id: getTranslationId('configuration.description'), defaultMessage: 'You have configuration problems to resolve'}),
        icon: (
            <ConfigurationSvg
                width={20}
                height={20}
            />
        ),
        items: [
            {
                id: 'ssl',
                title: formatMessage({
                    id: getTranslationId('configuration.ssl.title'),
                    defaultMessage: 'Configure SSL to make your server more secure',
                }),
                description: formatMessage({
                    id: getTranslationId('configuration.ssl.title'),
                    defaultMessage: 'You should configure SSL to secure how your server is accessed in a production environment.',
                }),
                configUrl: '/ssl-settings',
                infoUrl: 'https://www.google.de',
                status: data.ssl.status,
            },
            {
                id: 'session-length',
                title: formatMessage({
                    id: getTranslationId('session_length.title'),
                    defaultMessage: 'Session length is still set to defaults',
                }),
                description: formatMessage({
                    id: getTranslationId('session_length.title'),
                    defaultMessage: 'Your session length is still set to the default of 30 days. Most servers adjust this according to thier organizations needs. To provide more convenience to your users consider increasing the lengths, however if tighter security is more top of mind then pick a length that better aligns with your organizations policies.',
                }),
                configUrl: '/session-length',
                infoUrl: 'https://www.google.de',
                status: data.sessionLength.status,
            },
        ],
    });

    type AccessParam = {
        siteUrl: {
            status: ItemStatus;
        };
    }

    const getAccessData = (data: AccessParam) => ({
        title: formatMessage({
            id: getTranslationId('access.title'),
            defaultMessage: 'Workspace Access',
        }),
        description: formatMessage({
            id: getTranslationId('access.description'),
            defaultMessage: 'Web server settings could be affecting access.',
        }),
        icon: (
            <WorkspaceAccessSvg
                width={20}
                height={20}
            />
        ),
        items: [
            {
                id: 'site-url',
                title: formatMessage({
                    id: getTranslationId('access.site_url.title'),
                    defaultMessage: 'Misconfigured Web Server',
                }),
                description: formatMessage({
                    id: getTranslationId('access.site_url.description'),
                    defaultMessage: 'Your webserver settings are not passing a live URL test, this would prevent users from accessing this workspace, we recommend updating your settings.',
                }),
                configUrl: '/site-url',
                infoUrl: 'https://www.google.de',
                status: data.siteUrl.status,
            },
        ],
    });

    type PerformanceParam = {
        search: {
            totalUsers: number;
            totalPosts: number;
            status: ItemStatus;
        };
    }

    const getPerformanceData = (data: PerformanceParam) => ({
        title: formatMessage({
            id: getTranslationId('performance.title'),
            defaultMessage: 'Performance',
        }),
        description: formatMessage({
            id: getTranslationId('performance.description'),
            defaultMessage: 'Your server could use some performance tweaks.',
        }),
        icon: (
            <PerformanceSvg
                width={20}
                height={20}
            />
        ),
        items: [
            {
                id: 'search',
                title: formatMessage({
                    id: getTranslationId('performance.search.title'),
                    defaultMessage: 'Search performance',
                }),
                description: formatMessage({
                    id: getTranslationId('performance.search.description'),
                    defaultMessage: 'Your server has reached over {users} users and {posts} posts which could result in slow search performance. We recommend starting an enterprise trial with the elastic search feature for better performance.',
                }, {users: data.search.totalUsers, posts: data.search.totalPosts}),
                configUrl: '/site-url',
                infoUrl: 'https://www.google.de',
                status: data.search.status,
            },
        ],
    });

    type SecurityParam = {
        loginAttempts: {
            count: number;
            status: ItemStatus;
        };
    }

    // TBD
    const getSecurityData = (data: SecurityParam) => ({
        title: formatMessage({
            id: getTranslationId('security.title'),
            defaultMessage: 'Security Concerns',
        }),
        description: formatMessage({
            id: getTranslationId('security.description'),
            defaultMessage: 'There are security concerns you should look at.',
        }),
        icon: (
            <SecuritySvg
                width={20}
                height={20}
            />
        ),
        items: [
            {
                id: 'login-attempts',
                title: formatMessage({
                    id: getTranslationId('security.login_attempts.title'),
                    defaultMessage: 'Failed login attempts detected',
                }),
                description: formatMessage({
                    id: getTranslationId('security.login_attempts.description'),
                    defaultMessage: '{attempts} Failed login attempts have been detected. We recommend looking at the security logs to understand the risk.',
                }, {attempts: data.loginAttempts.count}),
                configUrl: '/site-url',
                infoUrl: 'https://www.google.de',
                status: data.loginAttempts.status,
            },
        ],
    });

    type DataPrivacyParam = {
        retention: {
            status: ItemStatus;
        };
    }

    // TBD
    const getDataPrivacyData = (data: DataPrivacyParam) => ({
        title: formatMessage({
            id: getTranslationId('data_privacy.title'),
            defaultMessage: 'Data Privacy',
        }),
        description: formatMessage({
            id: getTranslationId('data_privacy.description'),
            defaultMessage: 'Get better insight and control over your data.',
        }),
        icon: (
            <DataPrivacySvg
                width={20}
                height={20}
            />
        ),
        items: [
            {
                id: 'privacy',
                title: formatMessage({
                    id: getTranslationId('data_privacy.retention.title'),
                    defaultMessage: 'Become more data aware',
                }),
                description: formatMessage({
                    id: getTranslationId('data_privacy.retention.description'),
                    defaultMessage: 'A lot of organizations in highly regulated indsutries require more control and insight with thier data. Become more aware and take control of your data by trying out data retention and compliance features.',
                }),
                configUrl: '/site-url',
                infoUrl: 'https://www.google.de',
                status: data.retention.status,
            },
        ],
    });

    type EaseOfManagementParam = {
        ldap: {
            status: ItemStatus;
        };
        guestAccounts: {
            status: ItemStatus;
        };
    }

    // TBD
    const getEaseOfManagementData = (data: EaseOfManagementParam) => ({
        title: formatMessage({
            id: getTranslationId('ease_of_management.title'),
            defaultMessage: 'Ease of management',
        }),
        description: formatMessage({
            id: getTranslationId('ease_of_management.description'),
            defaultMessage: 'We have suggestions that could make your managemenet easier.',
        }),
        icon: (
            <EasyManagementSvg
                width={20}
                height={20}
            />
        ),
        items: [
            {
                id: 'ldap',
                title: formatMessage({
                    id: getTranslationId('ease_of_management.ldap.title'),
                    defaultMessage: 'AD/LDAP integration recommended',
                }),
                description: formatMessage({
                    id: getTranslationId('ease_of_management.ldap.description'),
                    defaultMessage: 'You’ve reached over 100 users, we can reduce your manual management pains through AD/LDAP with features like easier onboarding, automatic deactivations and automatic role assignments.',
                }),
                configUrl: '/site-url',
                infoUrl: 'https://www.google.de',
                status: data.ldap.status,
            },
            {
                id: 'guests_accounts',
                title: formatMessage({
                    id: getTranslationId('ease_of_management.guests_accounts.title'),
                    defaultMessage: 'Guest Accounts recommended',
                }),
                description: formatMessage({
                    id: getTranslationId('ease_of_management.guests_accounts.description'),
                    defaultMessage: 'We noticed several accounts using different domains from your Site URL. Gain more control over what other organizations can access with the guest account feature.',
                }),
                configUrl: '/site-url',
                infoUrl: 'https://www.google.de',
                status: data.guestAccounts.status,
            },
        ],
    });

    return {getAccessData, getConfigurationData, getUpdatesData, getPerformanceData, getSecurityData, getDataPrivacyData, getEaseOfManagementData};
};

export {DataModel, ItemModel, ItemStatus};
export default useMetricsData;
