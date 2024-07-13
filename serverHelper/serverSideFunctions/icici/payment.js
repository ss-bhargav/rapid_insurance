import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { IciciAccessTokenHandler2 } from './auth';
import CryptoJS from "crypto-js";
import Base64 from 'crypto-js/enc-base64';
import MemoryStream from "memorystream"

// 1.Key, IV convert into Base64 bytes format (FromBase64String)
// 2.key, IV need to pass to AES method CreateEncryptor
// 3.password+tickscount (DateTime.UtcNow.Ticks) needs to convert in ASCII bytes (Encoding.ASCII.GetBytes)
// 4.ASCII bytes need to pass to AES MemoryStream
// 5.returned memory stream value need to convert into Base64 String format (ToBase64String)
// 6.UserName:Base64 formated memory stream:tikscount need to convert into ASCII bytes(Encoding.ASCII.GetBytes) then convert whole bytes to Base64 String format(ToBase64String)

export const icicCreateTransactionsHandler = async (req, res) => {

     const credientials = {
          application_id: 248,
          username: "LMVInsureApp",
          password: "wuLS9ujyAgdGbtgk@",
          key: "QLh+FSxWNKJrAZCBJIThpA==",
          iv: "GSwy4EKpuVso2uQXoJ2BmobF6jHy5ImcUfmtfL5Ia6s="
     }

     function fromBase64String(string) {
          const data = atob(string);
          const array = Uint8Array.from(data, b => b.charCodeAt(0));
          return array
     }

     let key = btoa(credientials.key)
     let IV = btoa(credientials.iv)

     const keyIvEncryption = CryptoJS.AES.encrypt(key, IV).toString();
     const now = new Date()
     const ticks = ((now.getTime() * 10000) + 621355968000000000);

     console.log(key, IV)
     console.log(ticks)

     const cipher = `${credientials.password}${ticks}`

     let cipherText = "";

     for (var i = 0; i < cipher.length; i++) {
          cipherText += cipher.charCodeAt(i)
     }

     console.log(cipherText)

     let opStream = new MemoryStream()

     let ms = new MemoryStream(cipherText)

     console.log(ms)

     // const passwordTick = `${credientials.password + timeStamp}`
     // console.log(passwordTick)
     // const defaultPassTick = ""
     // const encryptPassword = CryptoJS.AES.encrypt(passwordTick, keyIvEncryption).toString();

     // const encryptUsername = CryptoJS.AES.encrypt(credientials.username, keyIvEncryption).toString();

     // const encryptTickcounts = CryptoJS.AES.encrypt(timeStamp.toString(), keyIvEncryption).toString();

     // const encryptString = `${encryptUsername}:${encryptPassword}:${encryptTickcounts}`

     let base64 = btoa("encryptString")

     const headers = {
          "Content-Type": "application/json",
          "Authorization": `Basic ${base64}`
     }

     const URL = `${process.env.ICICI_PAYMENT_UAT}/${process.env.ICICI_PAYMENT_CREATE}`

     const mainURL = "https://ilesb01.insurancearticlez.com/pgi/api/transaction/CreateBaseTransaction"

     const transaction_object = {
          TransactionId: uuidv4(),
          Amount: 500,
          ApplicationId: 248,
          ReturnUrl: 'http://localhost:3000',
          AdditionalInfo1: "2147689770",
          AdditionalInfo2: "101735184703",
          AdditionalInfo3: "MH01EM9099",
          AdditionalInfo4: "9666606228"
     }

     let encodedParams = new URLSearchParams()

     encodedParams.append("TransactionId", uuidv4())
     encodedParams.append("Amount", 500)
     encodedParams.append("ApplicationId", 248)
     encodedParams.append("ReturnUrl", "http://localhost:3000")
     encodedParams.append("AdditionalInfo1", '2147689770')
     encodedParams.append("AdditionalInfo2", '101735184703')
     encodedParams.append("AdditionalInfo3", 'MH01EM9099')
     encodedParams.append("AdditionalInfo4", '9666606228')

     try {
          const { data } = await axios.post(URL, transaction_object, { headers: headers })
          res.send(data)
     } catch (err) {
          res.send({ message: err.message })
     }
}