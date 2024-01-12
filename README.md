# react-native-patternlock-authentication

Pattern Lock Security for both Android and IOS using react native svg.

### Featured Pattern Working Gif

![Set New Pattern](https://github.com/senthalan2/react-native-patternlock-authentication/blob/main/Assets/FeaturedPatternLock%20Gifs/SetNewPattern.gif)
![Change Pattern](https://github.com/senthalan2/react-native-patternlock-authentication/blob/main/Assets/FeaturedPatternLock%20Gifs/ChangePattern.gif)
![Confirm Pattern](https://github.com/senthalan2/react-native-patternlock-authentication/blob/main/Assets/FeaturedPatternLock%20Gifs/ConfirmPattern.gif)

### General Pattern Working Gif

![General Pattern](https://github.com/senthalan2/react-native-patternlock-authentication/blob/main/Assets/GeneralPatternLockGifs/GeneralPattern.gif)

## Installation

`Note:` To use this Authentication, ensure that you have `react-native-svg` and its dependencies ([follow this guide](https://www.npmjs.com/package/react-native-svg)).

```sh
npm install react-native-patternlock-authentication
```

## Usage

There are two types of PatternLock Available in this Package.

1. GeneralPatternLock
2. FeaturedPatternLock

<!-- [FeaturedPatternLock](https://github.com/senthalan2/react-native-patternlock-authentication/blob/main/README.md#L150-L297) -->
<!-- FeaturedPatternLock -->

## GeneralPatternLock

```js
import { Dimensions } from 'react-native';

// ....

import { GeneralPatternLock } from 'react-native-patternlock-authentication'; // Import Package

const { width, height } = Dimensions.get('window');
const PATTERN_CONTAINER_HEIGHT = height / 2; //you can change it as per your need
const PATTERN_CONTAINER_WIDTH = width; //you can change it as per your need
const PATTERN_DIMENSION = 3; //you can change it as per your need
const CORRECT_UNLOCK_PATTERN = '0123'; //Correct Pattern

// ...

export const App = () => {
  const onPatternMatch = () => {
    // Do your Functionalities
  };

  const onWrongPattern = () => {
    // Do your Functionalities
  };

  const onPatternMatchAfterDelay = () => {
    // Do your Functionalities
  };

  const onWrongPatternAfterDelay = () => {
    // Do your Functionalities
  };

  return (
    //...

    <GeneralPatternLock
      containerDimension={PATTERN_DIMENSION}
      containerWidth={PATTERN_CONTAINER_WIDTH}
      containerHeight={PATTERN_CONTAINER_HEIGHT}
      correctPattern={CORRECT_UNLOCK_PATTERN}
      dotsAndLineColor="blue"
      defaultDotRadius={10}
      snapDotRadius={15}
      snapDuration={100}
      lineStrokeWidth={5}
      wrongPatternColor="red"
      matchedPatternColor="green"
      onPatternMatch={onPatternMatch}
      onWrongPatternAfterDelay={onWrongPatternAfterDelay}
      onPatternMatchAfterDelay={onPatternMatchAfterDelay}
      onWrongPattern={onWrongPattern}

      // ...Use Remaining Props as per your convenience
    />

    //...
  );
};
```

### Props

| Props                   | Type                  | Required | Default                             | Description                                                                            |
| ----------------------- | --------------------- | -------- | ----------------------------------- | -------------------------------------------------------------------------------------- |
| containerDimension      | Number                | No       | 3                                   | It Refers the Dimension of the Pattern Dots Array (eg.). 3 means 3 x 3, 4 means 4 x 4. |
| containerWidth          | Number                | No       | Dimensions.get('window').width      |
| containerHeight         | Number                | No       | (Dimensions.get('window').height)/2 |
| correctPattern          | String                | Yes      |
| wrongPatternDelayTime   | Number (MilliSeconds) | No       | 1000                                | Pattern draw event disable duration after the Wrong Pattern.                           |
| correctPatternDelayTime | Number                | No       | 0                                   | Pattern draw event disable duration after the Correct Pattern.                         |
| dotsAndLineColor        | String                | No       | blue                                |
| wrongPatternColor       | String                | No       | red                                 |
| lineStrokeWidth         | Number                | No       | 5                                   | Thickness of Line                                                                      |
| defaultDotRadius        | Number                | No       | 6                                   |
| snapDotRadius           | Number                | No       | 10                                  | Snaping radius of Dots When Connecting the Dots.                                       |
| snapDuration            | Number                | No       | 100                                 | Snaping duration of Dots When Connecting the Dots.                                     |
| enableHint              | Boolean               | No       | false                               |
| hint                    | String                | No       |
| hintContainerStyle      | ViewStyle             | No       |
| hintTextStyle           | TextStyle             | No       | { color: '#000000' }                |
| matchedPatternColor     | String                | No       | green                               |

### Methods

`onPatternMatch`

It will call, when the Pattern is Matched with Correct Pattern.

| Type     | Required |
| -------- | -------- |
| function | Yes      |

`onWrongPattern`

It will call, when the Pattern is Matched with Wrong Pattern.

| Type     | Required |
| -------- | -------- |
| function | No       |

`onPatternMatchAfterDelay`

It will call, when the Pattern is Matched with Correct Pattern after the `correctPatternDelayTime` which is passed as prop by you.

| Type     | Required |
| -------- | -------- |
| function | No       |

`onWrongPatternAfterDelay`

It will call, when the Pattern is Matched with Wrong Pattern after the `wrongPatternDelayTime` which is passed as prop by you.

| Type     | Required |
| -------- | -------- |
| function | No       |

## FeaturedPatternLock

It includes all Pattern Authentication Process like,

1. Confirm Your Pattern,
2. Change Pattern
3. Set New Pattern

```js
import { Dimensions } from 'react-native';

// ....

import {
  FeaturedPatternLock,
  PatternProcess,
} from 'react-native-patternlock-authentication'; // Import Package

const { width, height } = Dimensions.get('window');
const PATTERN_CONTAINER_HEIGHT = height / 2; //you can change it as per your need
const PATTERN_CONTAINER_WIDTH = width; //you can change it as per your need
const PATTERN_DIMENSION = 3; //you can change it as per your need

// ...

export const App = () => {
  const onPatternMatch = () => {
    // Do your Functionalities
  };

  const onWrongPattern = () => {
    // Do your Functionalities
  };

  const onPatternMatchAfterDelay = () => {
    // Do your Functionalities
  };

  const onWrongPatternAfterDelay = () => {
    // Do your Functionalities
  };

  return (
    //...

    <FeaturedPatternLock
      onPatternMatch={onPatternMatch}
      onWrongPattern={onWrongPattern}
      isChangePattern={false}
      processName={PatternProcess.NEW_PATTERN}

      // ...Use Remaining Props as per your convenience
    />

    //...
  );
};
```

### Props

| Props                                | Type      | Required                                                                                                               | Default                             | Description                                                                                                                                                                                              |
| ------------------------------------ | --------- | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| containerDimension                   | Number    | No                                                                                                                     | 3                                   | It Refers the Dimension of the Pattern Dots Array (eg.). 3 means 3 x 3, 4 means 4 x 4.                                                                                                                   |
| containerWidth                       | Number    | No                                                                                                                     | Dimensions.get('window').width      |
| containerHeight                      | Number    | No                                                                                                                     | (Dimensions.get('window').height)/2 |
| correctPattern                       | String    | Yes - when `processName` is `PatternProcess.CONFIRM_PATTERN`. No - when `processName` is `PatternProcess.NEW_PATTERN`. |
| processName                          | String    | No                                                                                                                     | PatternProcess.NEW_PATTERN          | `PatternProcess` Contains two processes. `NEW_PATTERN` and `CONFIRM_PATTERN`. `processName` must be `CONFIRM_PATTERN` for Change Pattern Process                                                         |
| isChangePattern                      | boolean   | No                                                                                                                     | false                               | If the Pattern is working as Change Pattern then change it to `true`                                                                                                                                     |
| showHintMessage                      | Boolean   | No                                                                                                                     | false                               |
| dotRadius                            | Number    | No                                                                                                                     | 10                                  |
| dotsColor                            | String    | No                                                                                                                     | red                                 |
| movingLineColor                      | String    | No                                                                                                                     | blue                                |
| snapDotRadius                        | Number    | No                                                                                                                     | 15                                  | Snaping radius of Dots When Connecting the Dots.                                                                                                                                                         |
| lineStrokeWidth                      | String    | No                                                                                                                     | 6                                   |
| activeLineColor                      | String    | No                                                                                                                     | blue                                |
| wrongPatternColor                    | String    | No                                                                                                                     | red                                 |
| snapDuration                         | Number    | No                                                                                                                     | 100 (milli seconds)                 | Snaping duration of Dots When Connecting the Dots.                                                                                                                                                       |
| connectedDotsColor                   | String    | No                                                                                                                     | blue                                |
| correctPatternColor                  | Number    | No                                                                                                                     | green                               |
| minPatternLength                     | Number    | No                                                                                                                     | 3                                   |
| newPatternConfirmationMessage        | String    | No                                                                                                                     | Empty String                        |
| wrongPatternDelayTime                | Number    | No                                                                                                                     | 1000 (milli seconds)                |
| correctPatternMessage                | String    | No                                                                                                                     | Empty String                        |
| correctPatternDelayTime              | Number    | No                                                                                                                     | 1000 (milli seconds)                |
| correctPatternDelayDurationMessage   | String    | No                                                                                                                     | Empty String                        |
| iswrongPatternCountLimited           | Boolean   | No                                                                                                                     | false                               | If there is maximum limit of Wrong Pattern then change it to true                                                                                                                                        |
| totalWrongPatternCount               | Number    | No                                                                                                                     | 0                                   | If `iswrongPatternCountLimited` is true then give maximum limit of Wrong Pattern                                                                                                                         |
| wrongPatternDelayDurationMessage     | String    | No                                                                                                                     | Empty String                        |
| minPatternLengthErrorMessage         | String    | No                                                                                                                     | Empty String                        |
| wrongPatternMessage                  | String    | No                                                                                                                     | Empty String                        |
| changePatternFirstMessage            | String    | No                                                                                                                     | Empty String                        |
| changePatternDelayTime               | Number    | No                                                                                                                     | 1000 (milli seconds)                |
| changePatternSecondMessage           | String    | No                                                                                                                     | Empty String                        |
| isEnableHeadingText                  | Boolean   | No                                                                                                                     | false                               |
| enableDotsJoinViration               | Boolean   | No                                                                                                                     | false                               | If it is `true`, then the mobile will be vibrate whenever the Pattern Dots Connects (Add Vibration Permissions). [Refer React Native Vibration](https://reactnative.dev/docs/vibration) for Permissions. |
| vibrationPattern                     | Array     | No                                                                                                                     | [0, 200]                            | Pattern of Vibration for connecting Dots. If `enableDotsJoinViration` is `true` then the Mobile Vibrates in this Pattern [Refer React Native Vibration](https://reactnative.dev/docs/vibration)          |
| headingText                          | String    | No                                                                                                                     | Empty String                        |
| enablePatternNotSameCondition        | Boolean   | No                                                                                                                     | true                                | If It is `true`, then the previous Pattern is not allowed for new Pattern when the time of Change Pattern Process. Change it to `false`, if the Previous Pattern is also allowed for New Pattern         |
| patternTotalCountReachedErrorMessage | String    | No                                                                                                                     | Empty String                        |
| newPatternDelayDurationMessage       | String    | No                                                                                                                     | Empty String                        |
| newPatternMatchedMessage             | String    | No                                                                                                                     | Empty String                        |
| newPatternDelayTime                  | Number    | No                                                                                                                     | 1000 (milli seconds)                |
| patternCountLimitedErrorMessage      | String    | No                                                                                                                     | Empty String                        |
| samePatternMatchedMessage            | String    | No                                                                                                                     | Empty String                        |
| hintTextStyle                        | TextStyle | No                                                                                                                     | { color: 'blue' }                   |
| headingTextStyle                     | TextStyle | No                                                                                                                     | { color: 'blue' }                   |
| hintTextContainerStyle               | ViewStyle | No                                                                                                                     | { alignItems: 'center' }            |

### Methods

`onPatternMatch`

It will call, when the Pattern is Matched with Correct Pattern.
It will also called after the Confirm Pattern of Set Pattern Process.
It returns `pattern` as callback Parameters.

| Type     | Required |
| -------- | -------- |
| function | Yes      |

`onWrongPattern`

It will call, whenever the Pattern is Matched with Wrong Pattern.
It returns `pattern` and `wrongPatternRemainingCount` ( if enable `iswrongPatternCountLimited` ) as callback Parameters.

| Type     | Required |
| -------- | -------- |
| function | No       |

`onPatternMatchAfterDelay`

It will call, when the Pattern is Matched with Correct Pattern after the `correctPatternDelayTime` which is passed as prop by you.
It will also called after the Confirm Pattern of Set Pattern Process.
It returns `pattern` as callback Parameters.

| Type     | Required |
| -------- | -------- |
| function | No       |

`onWrongPatternAfterDelay`

It will call, when the Pattern is Matched with Wrong Pattern after the `wrongPatternDelayTime` which is passed as prop by you.
It returns `pattern` and `wrongPatternRemainingCount` ( if enable `iswrongPatternCountLimited` ) as callback Parameters.

| Type     | Required |
| -------- | -------- |
| function | No       |

## License

MIT

## Would you like to support me?

<a href="https://www.buymeacoffee.com/senthalan2" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-red.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
