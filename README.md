# react-native-patternlock-authentication

Pattern Lock Security for both Android and IOS using react native svg.

## Installation

```sh
npm install react-native-patternlock-authentication
```

## Usage

There are two types of PatternLock Available in this Package.
1.NormalPatternLock
2.FeaturedPatternLock


## NormalPatternLock

```js
import { Dimensions } from 'react-native';

// ....

import { NormalPatternLock } from 'react-native-patternlock-authentication';  // Import Package

const { width, height } = Dimensions.get('window');
const PATTERN_CONTAINER_HEIGHT = height / 2;   //you can change it as per your need
const PATTERN_CONTAINER_WIDTH = width;         //you can change it as per your need
const PATTERN_DIMENSION = 3;                   //you can change it as per your need
const CORRECT_UNLOCK_PATTERN = '0123'          //Correct Pattern

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


return(
//...

<NormalPatternLock
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

)
}

```

## FeaturedPatternLock

```js
import { Dimensions } from 'react-native';

// ....

import { FeaturedPatternLock } from 'react-native-patternlock-authentication'; // Import Package

const { width, height } = Dimensions.get('window');
const PATTERN_CONTAINER_HEIGHT = height / 2;   //you can change it as per your need
const PATTERN_CONTAINER_WIDTH = width;         //you can change it as per your need
const PATTERN_DIMENSION = 3;                   //you can change it as per your need

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


return(
//...
      
      <FeaturedPatternLock
        onPatternMatch={onPatternMatch}
        onWrongPattern={onWrongPattern}
        isChangePattern={false}
        processName={PatternProcess.NEW_PATTERN}
        
        // ...Use Remaining Props as per your convenience
      />

//...

)
}

```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
