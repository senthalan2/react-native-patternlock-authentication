

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
npm  install  react-native-patternlock-authentication
```

---

# 🚀 Usage

This package provides two pattern lock components:

1.  **GeneralPatternLock** – Simple pattern validation

2.  **FeaturedPatternLock** – Complete authentication flow (Set / Confirm / Change)

---


## 🧩 1. GeneralPatternLock

Best for simple unlock validation screens.


### Example

```js

import { Dimensions } from  'react-native';

// ....

import { GeneralPatternLock } from  'react-native-patternlock-authentication'; // Import Package

const  {  width,  height  }  =  Dimensions.get('window');

const  PATTERN_CONTAINER_HEIGHT  =  height  /  2; //you can change it as per your need

const  PATTERN_CONTAINER_WIDTH  =  width; //you can change it as per your need
const  PATTERN_DIMENSION  =  3; //you can change it as per your need
const  CORRECT_UNLOCK_PATTERN  =  '0123'; //Correct Pattern

// ...

export const  App  =  ()  =>  {

const  onPatternMatch  =  ()  =>  {
	// Do your Functionalities
};

const  onWrongPattern  =  ()  =>  {
	// Do your Functionalities
};

const  onPatternMatchAfterDelay  =  ()  =>  {
	// Do your Functionalities
};

const  onWrongPatternAfterDelay  =  ()  =>  {
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
)};


```

---


### 🛠 GeneralPatternLock Props

| Props | Type | Required | Default | Description |
| ----------------------- | --------------- | -------- | -------------------------------------- | ---------------------------------------------------------------------------------------------- |
| containerDimension | number | No | 3 | It refers to the dimensions of the pattern dots array (e.g., 3 × 3, 4 × 4). |
| containerWidth | number | No | Dimensions.get('window').width | Width of the pattern container |
| containerHeight | number | No | (Dimensions.get('window').height)/2 | Height of the pattern container |
| correctPattern | string | No | - | The correct pattern string for validation |
| wrongPatternDelayTime | number (ms) | No | 1000 | Pattern draw event disable duration after a wrong pattern is entered. |
| correctPatternDelayTime | number | No | 0 | Pattern draw event disable duration after the correct pattern is matched. |
| dotsAndLineColor | ColorValue | No | blue | Color of dots and connecting lines |
| wrongPatternColor | ColorValue | No | red | Color of dots and line when pattern is wrong |
| lineStrokeWidth | number | No | 5 | Thickness of the connecting line |
| defaultDotRadius | number | No | 6 | Default radius of pattern dots |
| snapDotRadius | number | No | 10 | Snapping radius of dots when connecting them. |
| snapDuration | number | No | 100 | Snapping duration of dots when connecting them. |
| enableHint | boolean | No | false | Enable or disable hint display |
| hint | string | No | - | Hint text to display to the user |
| hintContainerStyle | ViewStyle | No | - | Custom style for the hint container |
| hintTextStyle | TextStyle | No | { color: '#000000' } | Custom style for the hint text |
| matchedPatternColor | ColorValue | No | green | Color of dots and line when pattern matches |

  

  

---

  

  

### 🎯 GeneralPatternLock Callbacks

  

| Callback | Returns | Description |
| -------------------------------- | --------------- | -------------------------------------------------- |
| onPatternMatch | `(pattern)` | Called when pattern matches |
| onWrongPattern | `(pattern)` | Called when pattern is wrong |
| onPatternMatchAfterDelay | `(pattern)` | Called after `correctPatternDelayTime` |
| onWrongPatternAfterDelay | `(pattern)` | Called after `wrongPatternDelayTime` |
  

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

import { Dimensions } from  'react-native';

// ....

import { FeaturedPatternLock,PatternProcess} from  'react-native-patternlock-authentication'; // Import Package

const  {  width,  height  }  =  Dimensions.get('window');

const  PATTERN_CONTAINER_HEIGHT  =  height  /  2; //you can change it as per your need
const  PATTERN_CONTAINER_WIDTH  =  width; //you can change it as per your need
const  PATTERN_DIMENSION  =  3; //you can change it as per your need

// ...

export const  App  =  ()  =>  {

const  onPatternMatch  =  ()  =>  {
// Do your Functionalities
};

const  onWrongPattern  =  ()  =>  {
// Do your Functionalities
};

const  onPatternMatchAfterDelay  =  ()  =>  {
// Do your Functionalities
};

const  onWrongPatternAfterDelay  =  ()  =>  {
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
)};

 
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

| Props | Type | Required | Default | Description |
| ---------------------------------------- | ------------------- | -------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| containerDimension | number | No | 3 | It refers to the dimensions of the pattern dots array (e.g., 3 × 3, 4 × 4). |
| containerWidth | number | No | Dimensions.get('window').width | Width of the pattern container |
| containerHeight | number | No | (Dimensions.get('window').height)/2 | Height of the pattern container |
| correctPattern | string | No | - | The correct pattern string for validation |
| processName | PatternProcess | No | PatternProcess.NEW_PATTERN | `PatternProcess` contains: `NEW_PATTERN` and `CONFIRM_PATTERN`. For Change Pattern, set to `CONFIRM_PATTERN`. |
| isChangePattern | boolean | No | false | If the pattern is being used as a Change Pattern, set this to `true`. |
| showHintMessage | boolean | No | false | Show/hide hint messages during pattern entry |
| dotRadius | number | No | 10 | Radius of pattern dots |
| dotsColor | ColorValue | No | red | Color of the pattern dots |
| movingLineColor | ColorValue | No | blue | Color of the line while drawing pattern |
| snapDotRadius | number | No | 15 | The snapping radius of dots while connecting them. |
| lineStrokeWidth | number | No | 6 | Width/thickness of the connecting line |
| activeLineColor | ColorValue | No | blue | Color of the active connecting line |
| wrongPatternColor | ColorValue | No | red | Color when pattern is wrong |
| snapDuration | number | No | 100 (ms) | The snapping duration of dots while connecting them. |
| connectedDotsColor | ColorValue | No | blue | Color of dots that have been connected |
| correctPatternColor | ColorValue | No | green | Color when pattern is correct |
| minPatternLength | number | No | 3 | Minimum number of dots required in pattern |
| wrongPatternDelayTime | number | No | 1000 (ms) | Delay time after wrong pattern before allowing new input |
| correctPatternDelayTime | number | No | 1000 (ms) | Delay time after correct pattern match |
| changePatternDelayTime | number | No | 1000 (ms) | Delay time when confirming old pattern during change pattern flow |
| newPatternDelayTime | number | No | 1000 (ms) | Delay time after setting new pattern before confirmation |
| isWrongPatternCountLimited | boolean | No | false | Set this to `true` if there is a maximum limit for wrong pattern attempts. |
| totalWrongPatternCount | number | No | 0 | If `isWrongPatternCountLimited` is true, specify the maximum limit for wrong pattern attempts. |
| isEnableHeadingText | boolean | No | false | Show/hide heading text |
| enableDotsJoinVibration | boolean | No | false | If set to `true`, the mobile will vibrate whenever pattern dots are connected (ensure vibration permissions are granted). |
| vibrationPattern | number[] | No | [0, 200] | Pattern of vibration when connecting dots. [Refer React Native Vibration](https://reactnative.dev/docs/vibration) |
| headingText | string | No | - | Custom heading text for the pattern lock screen |
| enablePatternNotSameCondition | boolean | No | true | If `true`, previous pattern cannot be used as new pattern during Change Pattern flow. |
| hintMessages | HintMessages | No | {} | Object containing context-specific hint messages for each pattern flow stage |
| hintTextStyle | TextStyle | No | { color: 'blue' } | Style for hint text |

| headingTextStyle | TextStyle | No | { color: 'blue' } | Style for heading text |

| hintTextContainerStyle | ViewStyle | No | { alignItems: 'center' } | Style for hint text container |

---

### 💬 HintMessages Reference

The `hintMessages` prop is an object containing flow-specific hint messages. Each message is optional and will use a default if not provided:

```js
hintMessages={{
// Confirm Pattern Flow
confirmPatternMismatchImmediate: 'Pattern Incorrect',
confirmPatternMismatchAfterDelay: 'Try Again',
confirmPatternMatchedImmediate: 'Pattern Matched',
confirmPatternMatchedAfterDelay: 'Successfully Confirmed',
confirmPatternTooShortError: 'Pattern Too Short',
confirmPatternAttemptsExhausted: 'Too Many Attempts',
confirmPatternLimitedWarningImmediate: '${remainingCount} attempt(s) left',
confirmPatternLimitedWarningAfterDelay: '${remainingCount} attempt(s) left',
// Set New Pattern Flow
setPatternTooShortError: 'Pattern Too Short',
setPatternTooShortAfterDelay: 'Try Again',
setPatternSuccessImmediate: 'Pattern Set',
// Confirm New Pattern Flow
confirmNewPatternInstruction: 'Confirm Pattern',
// Change Pattern - Confirm Current
changeConfirmCurrentMismatchImmediate: 'Pattern Incorrect',
changeConfirmCurrentMismatchAfterDelay: 'Try Again',
changeConfirmCurrentMatchedImmediate: 'Pattern Matched',
changeConfirmCurrentTooShortError: 'Pattern Too Short',
// Change Pattern - Set New
changeSetNewPatternInstruction: 'Set New Pattern',
changeSetNewPatternSameAsOldError: 'Same as Current Pattern',
changeSetNewPatternSameAsOldAfterDelay: 'Try Different Pattern',
changeSetNewPatternSuccessImmediate: 'Pattern Changed',
// Change Pattern - Confirm New
changeConfirmNewPatternInstruction: 'Confirm New Pattern',
}}

  

```


| Message Key | Flow Context | Trigger Event |
| ------------------------------------------------- | --------------------------------- | ---------------------------------------- |
| `confirmPatternMismatchImmediate` | Confirm Pattern | Wrong pattern entered |
| `confirmPatternMismatchAfterDelay` | Confirm Pattern | After delay on wrong entry |
| `confirmPatternMatchedImmediate` | Confirm Pattern | Correct pattern matched |
| `confirmPatternMatchedAfterDelay` | Confirm Pattern | After delay on match |
| `confirmPatternTooShortError` | Confirm Pattern | Pattern length too short |
| `confirmPatternAttemptsExhausted` | Confirm Pattern | Max attempts reached |
| `confirmPatternLimitedWarningImmediate` | Confirm Pattern | Limited attempts remain |
| `confirmPatternLimitedWarningAfterDelay` | Confirm Pattern | After delay limited attempts remain |
| `setPatternTooShortError` | Set New Pattern | Pattern length too short |
| `setPatternTooShortAfterDelay` | Set New Pattern | After delay on short entry |
| `setPatternSuccessImmediate` | Set New Pattern | Pattern set successfully |
| `confirmNewPatternInstruction` | Confirm New Pattern | Ready to confirm new |
| `changeConfirmCurrentMismatchImmediate` | Change - Confirm Current | Wrong current pattern |
| `changeConfirmCurrentMismatchAfterDelay` | Change - Confirm Current | After delay on wrong entry |
| `changeConfirmCurrentMatchedImmediate` | Change - Confirm Current | Current pattern confirmed |
| `changeConfirmCurrentTooShortError` | Change - Confirm Current | Pattern length too short |
| `changeSetNewPatternInstruction` | Change - Set New | Ready to set new pattern |
| `changeSetNewPatternSameAsOldError` | Change - Set New | New pattern same as old |
| `changeSetNewPatternSameAsOldAfterDelay` | Change - Set New | After delay on same error |
| `changeSetNewPatternSuccessImmediate` | Change - Set New | New pattern set success |
| `changeConfirmNewPatternInstruction` | Change - Confirm New | Ready to confirm new |

---

### 🎯 FeaturedPatternLock Callbacks

| Callback | Returns | Description |
| -------------------------------- | -------------------------------- | -------------------------------------------------- |
| onPatternMatch | `(pattern)` | Called when pattern matches |
| onWrongPattern | `(pattern, remainingCount?)` | Called when pattern is wrong |
| onPatternMatchAfterDelay | `(pattern)` | Called after `correctPatternDelayTime` |
| onWrongPatternAfterDelay | `(pattern, remainingCount?)` | Called after `wrongPatternDelayTime` |

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

<a  href="https://www.buymeacoffee.com/senthalan2"  target="_blank"><img  src="https://cdn.buymeacoffee.com/buttons/v2/default-red.png"  alt="Buy Me A Coffee"  style="height: 60px !important;width: 217px !important;" ></a>
