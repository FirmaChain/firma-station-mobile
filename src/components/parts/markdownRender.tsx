import React, { ComponentProps } from 'react';
import { DividerColor, TextAddressColor, TextCatTitleColor, TextColor, TextDarkGrayColor } from '@/constants/theme';
import Markdown from 'react-native-markdown-display';

const MarkdownRender = ({ markdown }: { markdown: string }) => {
    return <Markdown style={markdownStyles}>{markdown}</Markdown>;
};

const markdownStyles: ComponentProps<typeof Markdown>['style'] = {
    body: {
        color: TextCatTitleColor,
        fontSize: 16
    },
    paragraph: {
        marginTop: 0,
        marginBottom: 10
    },
    heading1: {
        color: TextColor,
        fontSize: 28,
        lineHeight: 36,
        fontWeight: 'bold',
        marginTop: 6,
        marginBottom: 10
    },
    heading2: {
        color: TextColor,
        fontSize: 24,
        lineHeight: 36,
        fontWeight: 'bold',
        marginTop: 6,
        marginBottom: 10
    },
    heading3: {
        color: TextColor,
        fontSize: 22,
        lineHeight: 33,
        fontWeight: 'bold',
        marginTop: 6,
        marginBottom: 8
    },
    heading4: {
        color: TextColor,
        fontSize: 20,
        lineHeight: 30,
        fontWeight: 'bold',
        marginTop: 4,
        marginBottom: 8
    },
    heading5: {
        color: TextColor,
        fontSize: 18,
        lineHeight: 27,
        marginTop: 4,
        marginBottom: 8
    },
    heading6: {
        color: TextColor,
        fontSize: 16,
        lineHeight: 24,
        marginTop: 4,
        marginBottom: 8
    },
    bullet_list: {
        marginVertical: 4
    },
    ordered_list: {
        marginVertical: 4
    },
    list_item: {
        color: TextCatTitleColor,
        fontSize: 16,
        lineHeight: 24
    },
    strong: {
        color: TextColor
    },
    strong_em: {
        fontStyle: 'italic',
        color: TextColor
    },
    em: {
        fontStyle: 'italic'
    },
    code_inline: {
        fontSize: 14,
        color: TextColor
    },
    code_block: {
        fontSize: 14,
        lineHeight: 20,
        color: TextColor
    },
    fence: {
        fontSize: 14,
        lineHeight: 20,
        color: TextColor
    },
    blockquote: {
        borderLeftColor: DividerColor,
        borderLeftWidth: 3,
        paddingLeft: 10,
        color: TextDarkGrayColor
    },
    link: {
        color: TextAddressColor
    },
    hr: {
        backgroundColor: DividerColor
    }
};

export default MarkdownRender;
