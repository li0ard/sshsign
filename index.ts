#! /usr/bin/env node

import { program } from "commander";
import sshpk, { type AlgorithmType } from "sshpk"
import fs from "fs"
import prompt from "./prompt.js"
import chalk from "chalk";

const error = chalk.bold.redBright
const log = chalk.bold.greenBright

interface inputOptions {
    key: string
    file?: string
    sfile?: string
}

const info = async ({key}: inputOptions) => {
    if(!key) return console.log(error("Please specify the path to the SSH key"))

    const pw = await prompt('Enter password: ');
    try {
        let pk = sshpk.parsePrivateKey(fs.readFileSync(key), "auto", {
            passphrase: pw
        })
        console.log("- type: " + pk.type)
        console.log("- size: " + pk.size)
        if (pk.type == "ecdsa" || pk.type == "ed25519") {
            console.log("- curve: " + pk.curve)
        }
        console.log("- fingerprint: " + pk.fingerprint())
    } catch(e) {
        console.log(error("You entered the wrong password"))
    }
}

const sign = async ({key, file}: inputOptions) => {
    if(!key) return console.log(error("Please specify the path to the SSH key"))
    if(!file) return console.log(error("Please specify the path to the signing file"))

    const pw = await prompt('Enter password: ');
    try {
        let fileToSign = fs.readFileSync(file)
        let pk = sshpk.parsePrivateKey(fs.readFileSync(key), "auto", {
            passphrase: pw
        })
        let s = pk.createSign(pk.defaultHashAlgorithm())
        s.update(fileToSign)
        let signature = s.sign()
        fs.writeFileSync(file + ".sig", `${signature.type}|${signature.toString("ssh")}`)
        console.log(log("Signature saved to " + file + ".sig"))
    } catch(e) {
        console.log(error("You entered the wrong password"))
    }
}

const verify = ({key, file, sfile}: inputOptions) => {
    if(!key) return console.log(error("Please specify the path to the SSH key"))
    if(!file) return console.log(error("Please specify the path to the signing file"))
    if(!sfile) return console.log(error("Please specify the path to the signature file"))

    let fileToSign = fs.readFileSync(file)
    let signatureFile = fs.readFileSync(sfile).toString()
    let pk = sshpk.parseKey(fs.readFileSync(key))
    let algorithm = signatureFile.split("|")[0]
    let signature = signatureFile.split("|")[1]

    let v = pk.createVerify(pk.defaultHashAlgorithm());
    v.update(fileToSign)
    if(v.verify(sshpk.parseSignature(signature, algorithm as AlgorithmType, "ssh"))) {
        console.log(log(`The signature is correct and belongs to the key with the fingerprint ${pk.fingerprint()}`))
    } else {
        console.log(error(`The signature is incorrect`))
    }
}

program.command("info")
.description("Get information about the SSH key")
.option("-k, --key <file>", "Path to the private key file")
.action(info)

program.command("sign")
.description("Signing a file with an SSH key")
.option("-k, --key <file>", "Path to the private key file")
.option("-f, --file <file>", "Path to the signing file")
.action(sign)

program.command("verify")
.description("Check the file signed with an SSH key")
.option("-k, --key <file>", "Path to the public key file")
.option("-f, --file <file>", "Path to the signing file")
.option("-s, --sfile <file>", "Path to the signature file")
.action(verify)

program.parse()