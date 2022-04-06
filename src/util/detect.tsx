import JailMonkey from 'jail-monkey';

export const Detect = () => {
    const jail = JailMonkey.isJailBroken();

    return jail
}