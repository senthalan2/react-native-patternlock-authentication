# 🔐 react-native-patternlock-authentication

> A customizable Pattern Lock Security component for **Android** and **iOS** built with React Native and SVG.

Create secure pattern authentication flows like:

- ✅ Set New Pattern
- 🔁 Change Pattern
- 🔒 Confirm Pattern
- 🎯 General Pattern Validation

---

## ✨ Features

- Fully customizable UI
- Smooth dot snapping animation
- Wrong pattern delay handling
- Pattern length validation
- Wrong attempt limit support
- Built-in Change Pattern flow
- Optional vibration feedback
- Works on both Android & iOS
- Built using `react-native-svg`

---

## 🎥 Demo

### 🔹 Set New Pattern

![Set New Pattern](https://github.com/senthalan2/react-native-patternlock-authentication/blob/main/Assets/FeaturedPatternLock%20Gifs/SetNewPattern.gif)

### 🔹 Change Pattern

![Change Pattern](https://github.com/senthalan2/react-native-patternlock-authentication/blob/main/Assets/FeaturedPatternLock%20Gifs/ChangePattern.gif)

### 🔹 Confirm Pattern

![Confirm Pattern](https://github.com/senthalan2/react-native-patternlock-authentication/blob/main/Assets/FeaturedPatternLock%20Gifs/ConfirmPattern.gif)

### 🔹 General Pattern

![General Pattern](https://github.com/senthalan2/react-native-patternlock-authentication/blob/main/Assets/GeneralPatternLockGifs/GeneralPattern.gif)

---

# 📦 Installation

> ⚠️ This package requires `react-native-svg`.

Follow the official installation guide: [react-native-svg ](https://www.npmjs.com/package/react-native-svg)

Then install:

```bash
npm install react-native-patternlock-authentication
```

---

# 🚀 Usage

This package provides two pattern lock components:

1. **GeneralPatternLock** – Simple pattern validation
2. **FeaturedPatternLock** – Complete authentication flow (Set / Confirm / Change)

---

## 🧩 1. GeneralPatternLock

Best for simple unlock validation screens.

### Example

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

      // ...Use remaining props as per your convenience
    />

    //...
  );
};
```

---

### 🛠 GeneralPatternLock Props

| Props                   | Type        | Required | Default                             | Description                                                                                 |
| ----------------------- | ----------- | -------- | ----------------------------------- | ------------------------------------------------------------------------------------------- |
| containerDimension      | number      | No       | 3                                   | It refers to the dimensions of the pattern dots array (e.g., 3 means 3 × 3, 4 means 4 × 4). |
| containerWidth          | number      | No       | Dimensions.get('window').width      |
| containerHeight         | number      | No       | (Dimensions.get('window').height)/2 |
| correctPattern          | string      | No       |
| wrongPatternDelayTime   | number (ms) | No       | 1000                                | Pattern draw event disable duration after the Wrong Pattern.                                |
| correctPatternDelayTime | number      | No       | 0                                   | Pattern draw event disable duration after the Correct Pattern.                              |
| dotsAndLineColor        | ColorValue  | No       | blue                                |
| wrongPatternColor       | ColorValue  | No       | red                                 |
| lineStrokeWidth         | number      | No       | 5                                   | Thickness of Line                                                                           |
| defaultDotRadius        | number      | No       | 6                                   |
| snapDotRadius           | number      | No       | 10                                  | Snaping radius of Dots When Connecting the Dots.                                            |
| snapDuration            | number      | No       | 100                                 | Snaping duration of Dots When Connecting the Dots.                                          |
| enableHint              | boolean     | No       | false                               |
| hint                    | string      | No       |
| hintContainerStyle      | ViewStyle   | No       |
| hintTextStyle           | TextStyle   | No       | { color: '#000000' }                |
| matchedPatternColor     | ColorValue  | No       | green                               |

---

### 🎯 GeneralPatternLock Callbacks

| Callback                 | Returns     | Description                            |
| ------------------------ | ----------- | -------------------------------------- |
| onPatternMatch           | `(pattern)` | Called when pattern matches            |
| onWrongPattern           | `(pattern)` | Called when pattern is wrong           |
| onPatternMatchAfterDelay | `(pattern)` | Called after `correctPatternDelayTime` |
| onWrongPatternAfterDelay | `(pattern)` | Called after `wrongPatternDelayTime`   |

---

## 🌟 2. FeaturedPatternLock

Complete pattern authentication workflow including:

- 🔐 Set New Pattern
- ✅ Confirm Pattern
- 🔁 Change Pattern
- 🚫 Wrong Attempt Limiting
- 📳 Optional Vibration Feedback

---

### Example

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

      // ...Use remaining props as per your convenience
    />

    //...
  );
};
```

---

### 🔄 PatternProcess Options

```js
PatternProcess.NEW_PATTERN;
PatternProcess.CONFIRM_PATTERN;
```

For Change Pattern:

- Set `processName={PatternProcess.CONFIRM_PATTERN}`
- Set `isChangePattern={true}`

---

### 🛠 FeaturedPatternLock Props

| Props                                | Type           | Required | Default                             | Description                                                                                                                                                                                                            |
| ------------------------------------ | -------------- | -------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| containerDimension                   | number         | No       | 3                                   | It refers to the dimensions of the pattern dots array (e.g., 3 means 3 × 3, 4 means 4 × 4).                                                                                                                            |
| containerWidth                       | number         | No       | Dimensions.get('window').width      |
| containerHeight                      | number         | No       | (Dimensions.get('window').height)/2 |
| correctPattern                       | string         | No       |
| processName                          | PatternProcess | No       | PatternProcess.NEW_PATTERN          | `PatternProcess` contains two processes: `NEW_PATTERN` and `CONFIRM_PATTERN`. For the Change Pattern process, `processName` must be set to `CONFIRM_PATTERN`.                                                          |
| isChangePattern                      | boolean        | No       | false                               | If the pattern is being used as a Change Pattern, set this to `true`.                                                                                                                                                  |
| showHintMessage                      | boolean        | No       | false                               |
| dotRadius                            | number         | No       | 10                                  |
| dotsColor                            | ColorValue     | No       | red                                 |
| movingLineColor                      | ColorValue     | No       | blue                                |
| snapDotRadius                        | number         | No       | 15                                  | The snapping radius of dots while connecting them.                                                                                                                                                                     |
| lineStrokeWidth                      | string         | No       | 6                                   |
| activeLineColor                      | ColorValue     | No       | blue                                |
| wrongPatternColor                    | ColorValue     | No       | red                                 |
| snapDuration                         | number         | No       | 100 (ms)                            | The snapping duration of dots while connecting them.                                                                                                                                                                   |
| connectedDotsColor                   | ColorValue     | No       | blue                                |
| correctPatternColor                  | ColorValue     | No       | green                               |
| minPatternLength                     | number         | No       | 3                                   |
| newPatternConfirmationMessage        | string         | No       | Empty String                        |
| wrongPatternDelayTime                | number         | No       | 1000 (milli seconds)                |
| correctPatternMessage                | string         | No       | Empty String                        |
| correctPatternDelayTime              | number         | No       | 1000 (milli seconds)                |
| correctPatternDelayDurationMessage   | string         | No       | Empty String                        |
| iswrongPatternCountLimited           | boolean        | No       | false                               | Set this to `true` if there is a maximum limit for wrong patterns.                                                                                                                                                     |
| totalWrongPatternCount               | number         | No       | 0                                   | If `isWrongPatternCountLimited` is true, specify the maximum limit for wrong patterns.                                                                                                                                 |
| wrongPatternDelayDurationMessage     | string         | No       | Empty String                        |
| minPatternLengthErrorMessage         | string         | No       | Empty String                        |
| wrongPatternMessage                  | string         | No       | Empty String                        |
| changePatternFirstMessage            | string         | No       | Empty String                        |
| changePatternDelayTime               | number         | No       | 1000 (milli seconds)                |
| changePatternSecondMessage           | string         | No       | Empty String                        |
| isEnableHeadingText                  | boolean        | No       | false                               |
| enableDotsJoinViration               | boolean        | No       | false                               | If set to `true`, the mobile will vibrate whenever the pattern dots are connected (ensure vibration permissions are granted).. [Refer React Native Vibration](https://reactnative.dev/docs/vibration) for Permissions. |
| vibrationPattern                     | number[]       | No       | [0, 200]                            | Pattern of vibration when connecting dots. If `enableDotsJoinVibration` is `true`, the mobile device will vibrate according to this pattern. [Refer React Native Vibration](https://reactnative.dev/docs/vibration)    |
| headingText                          | string         | No       | Empty String                        |
| enablePatternNotSameCondition        | boolean        | No       | true                                | If set to `true`, the previous pattern is not allowed as the new pattern during the Change Pattern process. Set it to `false` if the previous pattern can be used as the new pattern.                                  |
| patternTotalCountReachedErrorMessage | string         | No       | Empty String                        |
| newPatternDelayDurationMessage       | string         | No       | Empty String                        |
| newPatternMatchedMessage             | string         | No       | Empty String                        |
| newPatternDelayTime                  | number         | No       | 1000 (milli seconds)                |
| patternCountLimitedErrorMessage      | string         | No       | Empty String                        |
| samePatternMatchedMessage            | string         | No       | Empty String                        |
| hintTextStyle                        | TextStyle      | No       | { color: 'blue' }                   |
| headingTextStyle                     | TextStyle      | No       | { color: 'blue' }                   |
| hintTextContainerStyle               | ViewStyle      | No       | { alignItems: 'center' }            |

---

### 🎯 FeaturedPatternLock Callbacks

| Callback                 | Returns                      | Description                            |
| ------------------------ | ---------------------------- | -------------------------------------- |
| onPatternMatch           | `(pattern)`                  | Called when pattern matches            |
| onWrongPattern           | `(pattern, remainingCount?)` | Called when pattern is wrong           |
| onPatternMatchAfterDelay | `(pattern)`                  | Called after `correctPatternDelayTime` |
| onWrongPatternAfterDelay | `(pattern, remainingCount?)` | Called after `wrongPatternDelayTime`   |

---

## 💡 Best Practices

- Store patterns securely (e.g., encrypted storage)
- Combine with biometric authentication for better UX
- Use wrong attempt limits to prevent brute-force attacks
- Adjust snap radius for better touch experience on tablets

---

# 📄 License

MIT License

---

# ☕ Support the Project

If this package helps you, consider supporting ❤️

<a href="https://www.buymeacoffee.com/senthalan2" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-red.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
