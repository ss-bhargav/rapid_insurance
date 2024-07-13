

const INSURANCE_TYPES = {
    INSURANCE: {
        TWO_WHEELER: 'two_wheeler',
        PRIVATE_CAR: 'private_car',
        HEALTH: 'health'
    },
    TYPE: {
        PREMIUM: 'premium',
        PAYMENT_AND_PROPOSAL: 'payment_and_proposal'
    }
}

const KOTAK = {
    NAME: 'kotak',
    ...INSURANCE_TYPES,
}

export const constants = {
    kotak: {
        intermediate_code: "3169170000",
        intermediate_name: "DUMMY FOR TESTING",
        office_code: "90002",
        office_name: "MUMBAI-KALINA",
        two_wheeler: {},
        private_car: {},
    },
    tataAig: {
        quotation: {
            sol_Id: "1001"
        }
    }
};


module.exports = { KOTAK, constants }

