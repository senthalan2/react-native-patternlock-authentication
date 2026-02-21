import FeaturedPatternLock from './PatternLockAuthentication/FeaturedPatternLock';
import GeneralPatternLock from './PatternLockAuthentication/GeneralPatternLock'
import { getCorrectPatterninArray, getCorrectPatterninString } from './PatternLockAuthentication/Helpers'
export { FeaturedPatternLock, GeneralPatternLock };
export enum PatternProcess {
    CONFIRM_PATTERN = 'confirm_pattern',
    NEW_PATTERN = 'set_pattern',
};
export const PatternHelpers = {
    getCorrectPatterninArray, getCorrectPatterninString
}

