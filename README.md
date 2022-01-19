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
### Props


Props | Type | Required | Default | Description
--- | --- | --- | --- | --- 
containerDimension | Number | No | 3 | It Refers the Dimension of the Pattern Dots Array (eg.). 3 means 3 x 3, 4 means 4 x 4    
containerWidth | Number | No | Dimensions.get('window').width   
containerHeight | Number | No | (Dimensions.get('window').height)/2
correctPattern | String | Yes |  
wrongPatternDelayTime | Number | No | 1000 | It is in MilliSeconds. If the value is 1000, can't draw the pattern for 1000 milliseconds after the Wrong Pattern Event
correctPatternDelayTime | Number | No | 0    
dotsAndLineColor | String | No | blue   
wrongPatternColor | String | No | red
lineStrokeWidth | Number | No | 5 | Thickness of Line
defaultDotRadius | Number | No | 6
snapDotRadius | Number | No | 10    
snapDuration | Number | No | 100   
enableHint | Boolean | No | false
hint | String | No 
hintContainerStyle | ViewStyle | No 
hintTextStyle | TextStyle | No | { color: '#000000' }    
matchedPatternColor | String | No | green   

### Methods

```onPatternMatch```

It will call, when the Pattern is Matched with Correct Pattern,

```onWrongPattern```

It will call, when the Pattern is Matched with Wrong Pattern,

```onPatternMatchAfterDelay```

It will call, when the Pattern is Matched with Correct Pattern after the ```correctPatternDelayTime``` which is passed as prop by you,

```onWrongPatternAfterDelay```

It will call, when the Pattern is Matched with Wrong Pattern after the ```wrongPatternDelayTime``` which is passed as prop by you,


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
