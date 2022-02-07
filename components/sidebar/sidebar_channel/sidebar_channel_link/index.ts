// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';

import {getCurrentUserId, getMyChannelMemberships} from 'mattermost-redux/selectors/entities/common';
import {getInt} from 'mattermost-redux/selectors/entities/preferences';

import {Channel} from 'mattermost-redux/types/channels';
import {GenericAction} from 'mattermost-redux/types/actions';
import {isChannelMuted} from 'mattermost-redux/utils/channel_utils';
import {makeGetChannelUnreadCount} from 'mattermost-redux/selectors/entities/channels';
import {getConfig} from 'mattermost-redux/selectors/entities/general';

import {open as openLhs} from 'actions/views/lhs.js';
import {clearChannelSelection, multiSelectChannelAdd, multiSelectChannelTo} from 'actions/views/channel_sidebar';
import {getFirstChannelName} from 'selectors/onboarding';
import {isChannelSelected} from 'selectors/views/channel_sidebar';
import {getIsMobileView} from 'selectors/views/browser';
import {GlobalState} from 'types/store';
import Constants from 'utils/constants';
import {OnBoardingTourSteps, TutorialTourCategories} from 'components/tutorial_tour_tip/constant';

import SidebarChannelLink from './sidebar_channel_link';

type OwnProps = {
    channel: Channel;
}

function makeMapStateToProps() {
    const getUnreadCount = makeGetChannelUnreadCount();

    return (state: GlobalState, ownProps: OwnProps) => {
        const member = getMyChannelMemberships(state)[ownProps.channel.id];
        const unreadCount = getUnreadCount(state, ownProps.channel.id);
        const firstChannelName = getFirstChannelName(state);
        const config = getConfig(state);
        const enableTutorial = config.EnableTutorial === 'true';
        const currentUserId = getCurrentUserId(state);
        const tutorialStep = getInt(state, TutorialTourCategories.ON_BOARDING, currentUserId, 0);
        const showChannelsTutorialStep = enableTutorial && tutorialStep === OnBoardingTourSteps.CHANNELS_AND_DIRECT_MESSAGES;

        return {
            unreadMentions: unreadCount.mentions,
            unreadMsgs: unreadCount.messages,
            isUnread: unreadCount.showUnread,
            isMuted: isChannelMuted(member),
            isChannelSelected: isChannelSelected(state, ownProps.channel.id),
            firstChannelName: enableTutorial && tutorialStep === Constants.TutorialSteps.ADD_FIRST_CHANNEL ? firstChannelName : '',
            isMobileView: getIsMobileView(state),
            showChannelsTutorialStep,
        };
    };
}

function mapDispatchToProps(dispatch: Dispatch<GenericAction>) {
    return {
        actions: bindActionCreators({
            clearChannelSelection,
            multiSelectChannelTo,
            multiSelectChannelAdd,
            openLhs,
        }, dispatch),
    };
}

export default connect(makeMapStateToProps, mapDispatchToProps)(SidebarChannelLink);
