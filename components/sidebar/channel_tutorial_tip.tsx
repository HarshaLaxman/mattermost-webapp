// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {FormattedMessage} from 'react-intl';

import TutorialTip from 'components/tutorial/tutorial_tip';
import FormattedMarkdownMessage from 'components/formatted_markdown_message.jsx';
import {TutorialSteps} from 'utils/constants';

import HandsSvg from 'components/common/svg_images_components/hands_svg';

import {toTitleCase} from 'utils/utils';

type Props = {
    townSquareDisplayName?: string;
    offTopicDisplayName?: string;
    firstChannelName?: string;
    isMobileView: boolean;
    openLhs: () => void;
}

export default class ChannelTutorialTip extends React.PureComponent<Props> {
    componentDidMount() {
        if (this.props.townSquareDisplayName || this.props.offTopicDisplayName) {
            this.props.openLhs();
        }
    }

    render = () => {
        let overlayClass = 'tip-overlay--sidebar';
        let title = (
            <FormattedMessage
                id='sidebar.tutorialChannelTypes.title'
                defaultMessage={'Organize conversations in channels'}
            />
        );

        let screen = (
            <>
                <p>
                    <FormattedMarkdownMessage
                        id='sidebar.tutorialChannelTypes.channels'
                        defaultMessage={'Channels organize conversations across different topics.'}
                    />
                </p>
                <p>
                    <FormattedMarkdownMessage
                        id='sidebar.tutorialChannelTypes.public'
                        defaultMessage={'**Public channels** are open to everyone on your team.'}
                    />
                </p>
                <p>
                    <FormattedMarkdownMessage
                        id='sidebar.tutorialChannelTypes.private'
                        defaultMessage={'**Private channels** are for sensitive conversations between invited members.'}
                    />
                </p>
                <p>
                    <FormattedMarkdownMessage
                        id='sidebar.tutorialChannelTypes.direct'
                        defaultMessage={'**Direct messages** are for private conversations between individuals or small groups.'}
                    />
                </p>
            </>
        );

        let sidebarContainer = document.getElementById('sidebar-left');
        let telemetryTagText = 'tutorial_tip_2_channels';
        if (this.props.firstChannelName) {
            const displayFirstChannelName = this.props.firstChannelName.split('-').join(' ').trim();
            overlayClass += ' first-channel';
            title = (
                <FormattedMessage
                    id='create_first_channel.tutorialTip.title'
                    defaultMessage='Welcome to {firstChannelName}, your first channel!'
                    values={{firstChannelName: toTitleCase(displayFirstChannelName)}}
                />
            );
            screen = (
                <>
                    <div className='handSvg svg-wrapper'>
                        <HandsSvg
                            width={60}
                            height={60}
                        />
                    </div>
                    <p>
                        <FormattedMarkdownMessage
                            id='create_first_channel.tutorialTip1'
                            defaultMessage={'Start collaborating with your teammates and pull in your favorite plugins.'}
                        />
                    </p>
                </>
            );

            const channelId = this.props.firstChannelName.toLocaleLowerCase().replace(' ', '-');
            telemetryTagText = 'tutorial_tip_0_first_channel';
            sidebarContainer = document.getElementById('sidebarItem_' + channelId);
        }

        const sidebarContainerPosition = sidebarContainer && sidebarContainer.getBoundingClientRect();

        const tutorialTipPunchout = sidebarContainerPosition ? {
            x: `${sidebarContainerPosition.x}px`,
            y: `${sidebarContainerPosition.y}px`,
            width: `${sidebarContainerPosition.width}px`,
            height: `${sidebarContainerPosition.height}px`,
        } : undefined;

        return (
            <TutorialTip
                title={title}
                showOptOut={true}
                placement={this.props.isMobileView ? 'bottom' : 'right'}
                step={this.props.firstChannelName ? TutorialSteps.ADD_FIRST_CHANNEL : TutorialSteps.CHANNEL_POPOVER}
                screen={screen}
                overlayClass={overlayClass}
                telemetryTag={telemetryTagText}
                punchOut={tutorialTipPunchout}
            />
        );
    }
}

