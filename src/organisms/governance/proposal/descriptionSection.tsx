import React, { useMemo, useState } from 'react';
import LaunchIcon from '@/assets/icons/material/launch.svg';
import { CHAIN_SYMBOL, PROPOSAL_MESSAGE_TYPE, PROPOSAL_STATUS_DEPOSIT_PERIOD } from '@/constants/common';
import { BoxColor, DividerColor, Lato, TextAddressColor, TextCatTitleColor, TextColor, TextDarkGrayColor } from '@/constants/theme';
import { convertAmount, convertTime } from '@/util/common';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { IProposalDescriptionState } from '@/hooks/governance/hooks';
import MarkdownRender from '@/components/parts/markdownRender';

interface IProps {
    data: IProposalDescriptionState;
    handleMoveToExplorer: () => void;
}

const DescriptionSection = ({ data, handleMoveToExplorer }: IProps) => {
    const _CHAIN_SYMBOL = CHAIN_SYMBOL();
    const [openedMessageMap, setOpenedMessageMap] = useState<Record<number, boolean>>({});

    const isDepositPeriod = useMemo(() => {
        return data.status === PROPOSAL_STATUS_DEPOSIT_PERIOD;
    }, [data.status]);

    const InfoSection = useMemo(() => {
        if (data)
            return [
                { title: 'Proposal Type', data: PROPOSAL_MESSAGE_TYPE[data.proposalType] },
                { title: 'Submit Time', data: convertTime(data.submitTime, true) },
                {
                    title: 'Voting Start Time',
                    data: isDepositPeriod ? null : convertTime(data.votingStartTime, true)
                },
                {
                    title: 'Voting End Time',
                    data: isDepositPeriod ? null : convertTime(data.votingEndTime, true)
                },
                { title: 'Deposit Period', data: isDepositPeriod ? data.depositPeriod : null },
                {
                    title: 'Min Deposit Amount',
                    data: isDepositPeriod ? `${convertAmount({ value: data.minDeposit })} ${_CHAIN_SYMBOL}` : null
                },
                {
                    title: 'Current Deposit',
                    data: isDepositPeriod ? `${convertAmount({ value: data.proposalDeposit })} ${_CHAIN_SYMBOL}` : null
                }
            ];
        return [
            { title: 'Proposal Type', data: '' },
            { title: 'Submit Time', data: '' },
            { title: 'Voting Start Time', data: null },
            { title: 'Voting End Time', data: null },
            { title: 'Deposit Period', data: null },
            { title: 'Min Deposit Amount', data: null },
            { title: 'Current Deposit', data: null }
        ];
    }, [data, isDepositPeriod]);

    const Description = useMemo(() => {
        if (data) return { title: 'Description', data: data.description };
        return { title: 'Description', data: '' };
    }, [data]);

    const Classified = useMemo(() => {
        if (data) return data.classified;
        return null;
    }, [data]);

    const messages = useMemo(() => {
        if (!data) return [];
        if (data.isTextProposal) return [];
        if (!Array.isArray(data.messages)) return [];
        if (data.messages.length === 0) return [];
        return data.messages;
    }, [data]);

    const toggleMessage = (index: number) => {
        setOpenedMessageMap((prev) => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    // FIXME: Governance messages are supplied by chain modules with multiple schemas.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getMessageType = (message: any, index: number) => {
        const messageType = message?.content?.['@type'] || message?.['@type'];
        if (!messageType) return `Message #${index + 1}`;
        return String(messageType);
    };

    // FIXME: Governance messages are supplied by chain modules with multiple schemas.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getMessageName = (message: any, index: number) => {
        const rawType = getMessageType(message, index);
        if (rawType.startsWith('Message #')) return rawType;

        const slashSeparated = rawType.split('/');
        const lastSegment = slashSeparated[slashSeparated.length - 1] || rawType;
        const dotSeparated = lastSegment.split('.');
        return dotSeparated[dotSeparated.length - 1] || lastSegment;
    };

    // FIXME: Governance message fields are supplied by chain modules with multiple schemas.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parseRows = (value: any, parentKey = ''): Array<{ key: string; value: string }> => {
        const shouldSkipKey = (keyPath: string) => {
            if (!keyPath) return false;
            const lastKey = keyPath.split('.').pop() || keyPath;
            const normalized = lastKey.replace(/\[\d+\]/g, '').toLowerCase();
            return normalized === 'title' || normalized === 'description';
        };

        if (shouldSkipKey(parentKey)) {
            return [];
        }

        if (value === null || value === undefined) {
            return [{ key: parentKey || '-', value: '-' }];
        }

        if (Array.isArray(value)) {
            if (value.length === 0) {
                return [{ key: parentKey || '-', value: '[]' }];
            }
            return value.flatMap((item, index) => parseRows(item, `${parentKey}[${index}]`));
        }

        if (typeof value === 'object') {
            const entries = Object.entries(value);
            if (entries.length === 0) {
                return [{ key: parentKey || '-', value: '{}' }];
            }
            return entries.flatMap(([key, item]) => parseRows(item, parentKey ? `${parentKey}.${key}` : key));
        }

        return [{ key: parentKey || 'value', value: String(value) }];
    };

    // FIXME: Classified governance content depends on external message schemas.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const convertClassified = (classified: any) => {
        if (classified === undefined || classified === null) return;
        if (classified.changes) {
            return (
                <View style={styles.depositBox}>
                    <Text style={[styles.title, styles.titleV, { color: TextColor }]}>Change Parameters</Text>
                    <Text style={[styles.desc, { fontSize: 16 }]}>{JSON.stringify(classified.changes)}</Text>
                </View>
            );
        }

        if (classified.version) {
            return (
                <View style={styles.boxV}>
                    <View style={[styles.boxV, { paddingTop: 30 }]}>
                        <Text style={[styles.title, styles.titleV]}>Height</Text>
                        <Text style={[styles.desc, { fontSize: 16 }]}>{classified.height}</Text>
                    </View>
                    <View style={[styles.boxV, { paddingTop: 30 }]}>
                        <Text style={[styles.title, styles.titleV]}>Version</Text>
                        <Text style={[styles.desc, { fontSize: 16 }]}>{classified.version}</Text>
                    </View>
                    <View style={[styles.boxV, { paddingTop: 30 }]}>
                        <Text style={[styles.title, styles.titleV]}>Info</Text>
                        <Text style={[styles.desc, { fontSize: 16 }]}>{classified.info}</Text>
                    </View>
                </View>
            );
        }

        if (classified.recipient) {
            return (
                <View style={styles.boxV}>
                    <View style={[styles.boxV, { paddingTop: 30 }]}>
                        <Text style={[styles.title, styles.titleV]}>Recipient</Text>
                        <Text style={[styles.desc, { fontSize: 16 }]}>{classified.recipient}</Text>
                    </View>
                    <View style={[styles.boxV, { paddingTop: 30 }]}>
                        <Text style={[styles.title, styles.titleV]}>Amount</Text>
                        <Text
                            style={[styles.desc, { fontSize: 16 }]}
                        >{`${convertAmount({ value: classified.amount })} ${_CHAIN_SYMBOL}`}</Text>
                    </View>
                </View>
            );
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.divider} />
            <View style={[styles.boxV, { paddingTop: 20, paddingBottom: 10 }]}>
                {InfoSection.map((value, index) => {
                    return (
                        <View
                            key={index}
                            style={[
                                styles.boxH,
                                { justifyContent: 'space-between' },
                                index <= InfoSection.length - 1 && { paddingBottom: 10 },
                                !value.data && { display: 'none' }
                            ]}
                        >
                            <Text style={[styles.title, { fontSize: 14 }]}>{value.title}</Text>
                            <Text style={[styles.desc, { fontSize: 14, color: TextDarkGrayColor }]}>{value.data}</Text>
                        </View>
                    );
                })}
            </View>
            <View style={[styles.boxH, { justifyContent: 'flex-end', paddingBottom: 30 }]}>
                <TouchableOpacity style={[styles.boxH, { width: 'auto' }]} onPress={handleMoveToExplorer}>
                    <Text style={[styles.desc, { fontSize: 16, color: TextAddressColor }]}>More View</Text>
                    <LaunchIcon width={16} height={16} color={TextAddressColor} />
                </TouchableOpacity>
            </View>
            <View style={styles.dividerDashed} />
            <View style={[styles.boxV, { paddingVertical: 30 }]}>
                <View style={styles.boxV}>
                    <Text style={[styles.title, styles.titleV, { color: TextColor }]}>{Description.title}</Text>
                    <MarkdownRender markdown={Description.data} />
                </View>
                {messages.length > 0 && (
                    <View style={styles.messageContainer}>
                        <Text style={[styles.title, styles.titleV, { color: TextColor }]}>Messages</Text>
                        {messages.map((message, index) => {
                            const rows = parseRows(message);
                            const isOpened = Boolean(openedMessageMap[index]);

                            return (
                                <View key={index} style={styles.messageCard}>
                                    <TouchableOpacity
                                        style={[styles.boxH, { justifyContent: 'space-between', alignItems: 'flex-start' }]}
                                        onPress={() => toggleMessage(index)}
                                    >
                                        <Text style={[styles.desc, { fontSize: 14, flex: 1 }]}>{getMessageName(message, index)}</Text>
                                        <Text style={[styles.desc, { fontSize: 14, color: TextAddressColor }]}>
                                            {isOpened ? 'Hide' : 'Show'}
                                        </Text>
                                    </TouchableOpacity>
                                    {isOpened && (
                                        <View style={styles.tableWrap}>
                                            <View style={styles.tableRowHeader}>
                                                <Text style={[styles.tableHeaderText, styles.tableKeyCol]}>Key</Text>
                                                <Text style={[styles.tableHeaderText, styles.tableValueCol]}>Value</Text>
                                            </View>
                                            {rows.map((row, rowIndex) => (
                                                <View key={`${index}-${rowIndex}`} style={styles.tableRow}>
                                                    <Text style={[styles.tableCellText, styles.tableKeyCol]}>{row.key}</Text>
                                                    <Text style={[styles.tableCellText, styles.tableValueCol]}>{row.value}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            );
                        })}
                    </View>
                )}
                {convertClassified(Classified)}
            </View>
            <View style={styles.dividerDashed} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: DividerColor
    },
    dividerDashed: {
        width: '100%',
        height: 0,
        borderWidth: 1,
        borderColor: DividerColor,
        borderStyle: 'dashed'
    },
    boxH: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    depositBox: {
        width: '100%',
        backgroundColor: BoxColor,
        borderRadius: 8,
        padding: 20,
        marginTop: 36
    },
    messageContainer: {
        width: '100%',
        marginTop: 36
    },
    messageCard: {
        width: '100%',
        backgroundColor: BoxColor,
        borderRadius: 8,
        padding: 16,
        marginTop: 10
    },
    tableWrap: {
        width: '100%',
        marginTop: 12,
        borderWidth: 1,
        borderColor: DividerColor,
        borderRadius: 8,
        overflow: 'hidden'
    },
    tableRowHeader: {
        width: '100%',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: DividerColor,
        backgroundColor: '#25252d'
    },
    tableRow: {
        width: '100%',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: DividerColor
    },
    tableHeaderText: {
        fontFamily: Lato,
        color: TextColor,
        fontWeight: '600',
        fontSize: 13,
        paddingVertical: 10,
        paddingHorizontal: 12
    },
    tableCellText: {
        fontFamily: Lato,
        color: TextCatTitleColor,
        fontSize: 12,
        lineHeight: 18,
        paddingVertical: 10,
        paddingHorizontal: 12
    },
    tableKeyCol: {
        width: '38%',
        borderRightWidth: 1,
        borderRightColor: DividerColor
    },
    tableValueCol: {
        width: '62%'
    },
    boxV: {
        alignItems: 'flex-start'
    },
    title: {
        fontFamily: Lato,
        fontWeight: '600',
        color: TextDarkGrayColor
    },
    desc: {
        fontFamily: Lato,
        fontWeight: 'normal',
        color: TextCatTitleColor
    },
    titleV: {
        fontSize: 18,
        paddingBottom: 11
    }
});

export default DescriptionSection;
