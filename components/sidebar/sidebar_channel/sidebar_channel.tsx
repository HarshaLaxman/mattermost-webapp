// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {TransitionEvent, TransitionEventHandler} from 'react';
import {Draggable, DraggableProvidedDraggableProps} from 'react-beautiful-dnd';
import classNames from 'classnames';

import {Channel} from 'mattermost-redux/types/channels';

import FormattedMarkdownMessage from 'components/formatted_markdown_message';
import {DraggingState} from 'types/store';
import Constants from 'utils/constants';

import SidebarBaseChannel from './sidebar_base_channel';
import SidebarDirectChannel from './sidebar_direct_channel';
import SidebarGroupChannel from './sidebar_group_channel';

type Props = {

    /**
     * The channel object for this channel list item
     */
    channel: Channel;

    channelIndex: number;

    /**
     * If in a DM, the name of the user your DM is with
     */
    teammateUsername?: string;

    /**
     * The current team you are on
     */
    currentTeamName: string;

    /**
     * Number of unread mentions in this channel
     */
    unreadMentions: number;

    /**
     * Whether or not the channel is shown as unread
     */
    isUnread: boolean;

    /**
     * Gets the ref for a given channel id
     */
    getChannelRef: (channelId: string) => HTMLLIElement | undefined;

    /**
     * Sets the ref for the sidebar channel div element, so that it can be used by parent components
     */
    setChannelRef: (channelId: string, ref: HTMLLIElement) => void;

    /**
     * If category is collapsed
     */
    isCategoryCollapsed: boolean;

    /**
     * Is the channel the currently focused channel
     */
    isCurrentChannel: boolean;

    isAutoSortedCategory: boolean;

    isDraggable: boolean;

    draggingState: DraggingState;

    isCategoryDragged: boolean;

    isDropDisabled: boolean;

    isChannelSelected: boolean;

    multiSelectedChannelIds: string[];

    autoSortedCategoryIds: Set<string>;
};

type State = {
    show: boolean;
};

export default class SidebarChannel extends React.PureComponent<Props, State> {
    static defaultProps = {
        isDraggable: true,
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            show: true,
        };
    }

    isCollapsed = (props: Props) => {
        return props.isCategoryDragged || (props.isCategoryCollapsed && !this.props.isUnread && !props.isCurrentChannel);
    }

    getRef = () => {
        return this.props.getChannelRef(this.props.channel.id);
    }

    setRef = (refMethod?: (element: HTMLLIElement) => any) => {
        return (ref: HTMLLIElement) => {
            this.props.setChannelRef(this.props.channel.id, ref);
            refMethod?.(ref);
        };
    }

    handleTransitionEnd = (event: TransitionEvent<HTMLLIElement>, draggableOnTransitionEnd?: TransitionEventHandler<HTMLLIElement>) => {
        if (draggableOnTransitionEnd) {
            draggableOnTransitionEnd(event);
        }

        // On fully collapsed
        if (event.propertyName === 'height' && this.isCollapsed(this.props)) {
            this.setState({show: false});
        }

        // On fully expanded
        if (event.propertyName === 'height' && !this.isCollapsed(this.props)) {
            this.setState({show: true});
        }
    };

    wrapTransitionEndHandler = (draggableProps: DraggableProvidedDraggableProps) => {
        let handleTransitionEnd = this.handleTransitionEnd;
        if (draggableProps && draggableProps.onTransitionEnd) {
            // Pass the onTransitionEnd from draggable to the onTransitionEnd of the sidebar channel
            handleTransitionEnd = (event: TransitionEvent<HTMLLIElement>) => this.handleTransitionEnd(event, draggableProps.onTransitionEnd);
        }

        return {
            handleTransitionEnd,
            style: draggableProps?.style,
            'data-rbd-draggable-context-id': draggableProps?.['data-rbd-draggable-context-id'],
            'data-rbd-draggable-id': draggableProps?.['data-rbd-draggable-id'],
        };
    }

    render() {
        const {
            channel,
            channelIndex,
            currentTeamName,
            isCurrentChannel,
            isDraggable,
            isAutoSortedCategory,
            isChannelSelected,
            isUnread,
            draggingState,
            multiSelectedChannelIds,
            autoSortedCategoryIds,
        } = this.props;

        let ChannelComponent: React.ComponentType<{channel: Channel; currentTeamName: string; isCollapsed: boolean}> = SidebarBaseChannel;
        if (channel.type === Constants.DM_CHANNEL) {
            ChannelComponent = SidebarDirectChannel;
        } else if (channel.type === Constants.GM_CHANNEL) {
            ChannelComponent = SidebarGroupChannel;
        }

        const component = this.state.show ? (
            <ChannelComponent
                isCollapsed={this.isCollapsed(this.props)}
                channel={channel}
                currentTeamName={currentTeamName}
            />
        ) : null;

        let wrappedComponent: React.ReactNode;

        if (isDraggable) {
            let selectedCount: React.ReactNode;
            if (isChannelSelected && draggingState.state && draggingState.id === channel.id && multiSelectedChannelIds.length > 1) {
                selectedCount = this.state.show ? (
                    <div className='SidebarChannel__selectedCount'>
                        <FormattedMarkdownMessage
                            id='sidebar_left.sidebar_channel.selectedCount'
                            defaultMessage='{count} selected'
                            values={{count: multiSelectedChannelIds.length}}
                        />
                    </div>
                ) : null;
            }

            wrappedComponent = (
                <Draggable
                    draggableId={channel.id}
                    index={channelIndex}
                >
                    {(provided, snapshot) => {
                        const {handleTransitionEnd, ...draggableProps} = this.wrapTransitionEndHandler(provided.draggableProps);

                        return (
                            <li
                                draggable='false'
                                ref={this.setRef(provided.innerRef)}
                                className={classNames('SidebarChannel animating', {
                                    collapsed: this.isCollapsed(this.props),
                                    unread: isUnread,
                                    active: isCurrentChannel,
                                    dragging: snapshot.isDragging,
                                    selectedDragging: isChannelSelected && draggingState.state && draggingState.id !== channel.id,
                                    fadeOnDrop: snapshot.isDropAnimating && snapshot.draggingOver && autoSortedCategoryIds.has(snapshot.draggingOver),
                                    noFloat: isAutoSortedCategory && !snapshot.isDragging,
                                })}
                                onTransitionEnd={handleTransitionEnd}
                                {...draggableProps}
                                {...provided.dragHandleProps}
                                role='listitem'
                                tabIndex={-1}
                            >
                                {component}
                                {selectedCount}
                            </li>
                        );
                    }}
                </Draggable>
            );
        } else {
            wrappedComponent = (
                <li
                    ref={this.setRef()}
                    className={classNames('SidebarChannel animating', {
                        collapsed: this.isCollapsed(this.props),
                        unread: isUnread,
                        active: isCurrentChannel,
                    })}
                    onTransitionEnd={this.handleTransitionEnd}
                    role='listitem'
                >
                    {component}
                </li>
            );
        }

        return wrappedComponent;
    }
}
