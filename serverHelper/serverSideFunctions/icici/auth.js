import axios from "axios";


export const IciciAccessTokenHandler = async (client_object, Handler) => {

    const headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }

    const motorService = 'esbmotor'
    const idvService = 'esbmotormodel'
    const policyPdfService = 'esbpolicypdf'
    const paymentService = 'esbpayment'

    const body = {
        grant_type: "password",
        username: 'LmvInsure',
        password: 'L#v!n$ur3',
        scope: motorService,
        client_id: 'ro.LmvInsure',
        client_secret: 'ro.L#v!n$ur3'
    }

    let encodedParams = new URLSearchParams()

    encodedParams.append("grant_type", 'password')
    encodedParams.append("username", 'LmvInsure')
    encodedParams.append("password", 'L#v!n$ur3')
    encodedParams.append("scope", motorService)
    encodedParams.append("client_id", 'ro.LmvInsure')
    encodedParams.append("client_secret", 'ro.L#v!n$ur3')

    const URL = `${process.env.ICIC_SANITY}/${process.env.ICICI_ACCESS_TOKEN}`

    try {
        const { data } = await axios.post(URL, encodedParams, { headers: headers })
        if (data && data.access_token) {
            const authentication = {
                token: data.access_token,
                expires: data.expires_in,
                token_type: data.token_type
            }
            return Handler(client_object, authentication)
        } else {
            return {
                error: true,
                company: "icici",
                message: "Invalid authentication",
                // error_message: data.vErrorMsg,
            };
        }
    } catch (error) {
        return {
            error: true,
            company: "icici",
            message: `Error, Invalid authentication: Error Message: ${error.message}`,
            error_message: error.message,
        };
    }
};


export const IciciAccessTokenHandler2 = async () => {
    const headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }

    const motorService = 'esbmotor'
    const idvService = 'esbmotormodel'
    const policyPdfService = 'esbpolicypdf'
    const paymentService = 'esbpayment'

    let encodedParams = new URLSearchParams()

    encodedParams.append("grant_type", 'password')
    encodedParams.append("username", 'LmvInsure')
    encodedParams.append("password", 'L#v!n$ur3')
    encodedParams.append("scope", motorService)
    encodedParams.append("client_id", 'ro.LmvInsure')
    encodedParams.append("client_secret", 'ro.L#v!n$ur3')

    const URL = `${process.env.ICICI_UAT}/${process.env.ICICI_ACCESS_TOKEN}`

    try {
        const { data } = await axios.post(URL, encodedParams, { headers: headers })
        return { error: false, data: data }
    } catch (error) {
        return { error: true, message: error.message }
    }

}
