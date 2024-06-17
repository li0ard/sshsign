```

.▄▄ · .▄▄ ·  ▄ .▄.▄▄ · ▪   ▄▄ •  ▐ ▄ 
▐█ ▀. ▐█ ▀. ██▪▐█▐█ ▀. ██ ▐█ ▀ ▪•█▌▐█
▄▀▀▀█▄▄▀▀▀█▄██▀▐█▄▀▀▀█▄▐█·▄█ ▀█▄▐█▐▐▌
▐█▄▪▐█▐█▄▪▐███▌▐▀▐█▄▪▐█▐█▌▐█▄▪▐███▐█▌
 ▀▀▀▀  ▀▀▀▀ ▀▀▀ · ▀▀▀▀ ▀▀▀·▀▀▀▀ ▀▀ █▪

```

sshsign is yet another simple tool to sign files and verify signatures with SSH keys

## Installation

```
npm i -g sshsign
```

## Usage examples

Private key info:
```
sshsign info -k ../.ssh/id_ed25519
```

Sign:
```
sshsign sign -k ~/.ssh/id_ed25519 -f test.txt
```

Verify:
```
sshsign verify -k ~/.ssh/id_ed25519.pub -f test.txt -s test.txt.sig
```

### Signature file format (.sig)
The signature file format is quite simple

```
signature algorithm|base64 encoded signature
```

The list of signature algorithms is available [here](https://github.com/TritonDataCenter/node-sshpk/blob/master/lib/algs.js#L5)