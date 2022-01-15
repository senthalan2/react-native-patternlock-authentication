# react-native-patternlock-authentication

Pattern Lock Security for both Android and IOS using react native svg.

## Installation

```sh
npm install react-native-patternlock-authentication
```

## Usage

```js
import { PatternLock } from "react-native-patternlock-authentication";

// ...

const onPatternMatch = (matchedPattern) => {

  //Do your Functionlities

}

const onWrongPattern = (pattern,remainingWrongPatternCounts) => {   //remainingPatternCount return when you enable the wrong pattern limitation

//Do Your Functionlities

}

return(
//...

<PatternLock
onPatternMatch = {onPatternMatch}
onWrongPattern = {onWrongPattern}
{...restProps}  //use Rest of available props according to your convenience
/>

//...

)

```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
