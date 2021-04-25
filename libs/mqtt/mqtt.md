### mqtt.js

https://cdnjs.cloudflare.com/ajax/libs/mqtt/4.2.0/mqtt.js

https://cdnjs.cloudflare.com/ajax/libs/mqtt/4.2.0/mqtt.min.js

### long.js

https://github.com/dcodeIO/long.js

```
var Long = require("long");

var longVal = new Long(0xFFFFFFFF, 0x7FFFFFFF);

console.log(longVal.toString());
```

#### Fields

```
Long#low: number
The low 32 bits as a signed value.

Long#high: number
The high 32 bits as a signed value.

Long#unsigned: boolean
Whether unsigned or not.
```
### Utility

```
Long.isLong(obj: *): boolean
Tests if the specified object is a Long.

Long.fromBits(lowBits: number, highBits: number, unsigned?: boolean): Long
Returns a Long representing the 64 bit integer that comes by concatenating the given low and high bits. Each is assumed to use 32 bits.

Long.fromBytes(bytes: number[], unsigned?: boolean, le?: boolean): Long
Creates a Long from its byte representation.

Long.fromBytesLE(bytes: number[], unsigned?: boolean): Long
Creates a Long from its little endian byte representation.

Long.fromBytesBE(bytes: number[], unsigned?: boolean): Long
Creates a Long from its big endian byte representation.

Long.fromInt(value: number, unsigned?: boolean): Long
Returns a Long representing the given 32 bit integer value.

Long.fromNumber(value: number, unsigned?: boolean): Long
Returns a Long representing the given value, provided that it is a finite number. Otherwise, zero is returned.

Long.fromString(str: string, unsigned?: boolean, radix?: number)
Long.fromString(str: string, radix: number)
Returns a Long representation of the given string, written using the specified radix.

Long.fromValue(val: *, unsigned?: boolean): Long
Converts the specified value to a Long using the appropriate from* function for its type.
```


### mybuffer.js

https://github.com/feross/buffer

