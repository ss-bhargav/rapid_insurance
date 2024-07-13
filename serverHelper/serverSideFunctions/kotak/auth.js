import axios from "axios";
import CryptoJS from "crypto-js";
import btoa from "btoa";

const KotakAccessTokenHandler = async (client_object, next) => {
    let vRanKey = Math.floor(Math.random() * 8080808080808080 + 1);
    let key = CryptoJS.enc.Utf8.parse(vRanKey);
    let iv = CryptoJS.enc.Utf8.parse(vRanKey);

    let vEncryptedLogin = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse("BP000001"), key, {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });

    let vEncryptedPassword = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse("Admin@1234"), key, {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });

    vEncryptedLogin = btoa(vEncryptedLogin);
    vEncryptedPassword = btoa(vEncryptedPassword);

    const URL = `${process.env.KOTAK_UAT}/${process.env.KOTAK_ACCESS_TOKEN}`;
    const headers = {
        vRanKey: vRanKey,
        "Content-Type": "application/json",
    };
    const postData = {
        vLoginEmailId: vEncryptedLogin,
        vPassword: vEncryptedPassword,
    };

    try {
        const { data } = await axios.post(URL, postData, { headers: headers });
        if (data.vErrorMsg === "Success") {
            client_object = {
                ...client_object,
                authentication: {
                    token: data.vTokenCode,
                    email: data.vLoginEmailId,
                },
            };
            return next(client_object);
        } else {
            console.log("Authentation Error");
            return KotakAccessTokenHandler(client_object, next);
            // return {
            //     error: true,
            //     company_name: "kotak",
            //     message: "Invalid authentication",
            //     error_message: data.vErrorMsg,
            // };
        }
    } catch (error) {
        return {
            error: true,
            company_name: "kotak",
            message: "Something went wrong....!",
        };
    }
};

module.exports = { KotakAccessTokenHandler };
