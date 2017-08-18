# derive-password-bytes
A partial node.js implementation of the C# System.Security.Cryptography.PasswordDeriveBytes class. Specifically, the 
GetBytes method of that class.

This was necessary for a recent project where we had a Unity mobile client generating encrypted packages and needed them 
decrypted server-side in node. I could not find a native implementation of this specific algorithm as it was based on a 
standard (PBKDF1) but extended to allow generation of more than the normal 20 bytes.

To the best of my understanding, the algorithm generates a normal PBKDF1 byte array and uses those 20 bytes as the first 
20 to be returned. If more than 20 are requested by the GetBytes method, the PBKDF1 algorithm is invoked again with one 
less iteration to create an intermediate hash. Then it blah blah blah... You know what? Read this 
[Stack Overflow Answer](https://stackoverflow.com/a/27798812), if you want all the details. This is where I found the 
information I needed. It was the most comprehensive description of the MS key stretching algorithm.

### Installation
```bash
npm install derive-password-bytes
```

### Usage
```javascript 1.6
const derp = require('derive-password-bytes');
const key = derp('password', 'salt', 4, 'sha1', 32);
```

This is the equivalent of the following code in C#
```C#
using System.Security.Cryptography;
byte[] saltBytes = ASCIIEncoding.ASCII.GetBytes("salt");
PasswordDeriveBytes derp = new PasswordDeriveBytes("password", saltBytes, "SHA1", 4);
byte[] key = derp.GetBytes(32);
```

The value of `key` in both of these examples is essentially the same and can be used to create a cipher for encryption 
or decryption.