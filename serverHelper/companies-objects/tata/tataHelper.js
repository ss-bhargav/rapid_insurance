

const Token = "2D9D1BC5A837E7A2741C6121317E9EE6CE1D32145CBCF7084FA4493ECDA2C2804969A5473610BC2AB4FC034359C11D55F99F8AEC736D84F0EFD531DFE24FFC74F0923F1288A83121B8045A8AAA4D9F920B4D737E3A1134B824E23B1F0561D97AEA647554A31570720BDB6E4CE3D8813A1138ABF16F2A23A8E6BAB012DD07B768019A5B583351F6D36C1F6F26B5C8D474D2F701E664A96F73806EE3A5235DEFFD76CF4106F7F074A55258D75B1DDEFD38";



const ProductIds = {
    CvProductId: 3124,
    PcProductId: 3121,
    TwProductId: 3122,
}

const PostDataFunction = (QDATA, ProductId) => {
    return {
        QDATA: QDATA,
        SRC: "TP",
        T: Token,
        productid: ProductId,
    }
}

const headerObject = {
    header: {
        "Content-Type": "application/x-www-form-urlencoded"
    }
}


///////////////////////////////////////////////// Commercial Vechile - Quick Quote  //////////////////////////////

const CvQuickQuote = {
    functionality: 'validatequote',
    quote_type: 'quick',
    vehicle: {
        quotation_no: '',
        segment_code: '1',
        segment_name: 'Mini',
        cc: '145',
        sc: '4',
        FP_FLAG: 'N',
        sol_id: '1001',
        lead_id: 'sdfsdfdf',
        mobile_no: '9043314850',
        email_id: 'ermrajesh@godbtech.com',
        emp_email_id: '',
        customer_type: 'Individual',
        product_code: '3124',
        product_name: 'Commercial Vehicle',
        subproduct_code: '50',
        subproduct_name: 'Goods Carrying Vehicle',
        subclass_code: '61',
        subclass_name: 'Private Carrier-Motorized Three wheeler',
        misclass_code: '',
        misclass_name: 'Select Miscellaneous Vehicle',
        covertype_code: '1',
        covertype_name: 'Package',
        btype_code: '1',
        btype_name: 'New Business',
        risk_startdate: '20210828',
        risk_enddate: '20220827',
        purchase_date: '20210828',
        regi_date: '20210828',
        veh_age: '0',
        manf_year: '2021',
        make_code: '159',
        make_name: 'BAJAJ',
        model_code: '102383',
        model_name: 'RICKSHAW',
        variant_code: '20457',
        variant_name: 'RE AUTO',
        model_parent_code: '102383',
        fuel_code: '1',
        fuel_name: 'Petrol',
        gvw: '5',
        age: '0',
        miscdtype_code: '',
        bodytype_id: '34',
        idv: '',
        revised_idv: '',
        regno_1: 'tn',
        regno_2: '21',
        regno_3: 'th',
        regno_4: '5555',
        rto_loc_code: 'TN-21',
        rto_loc_name: 'Kanchipuram',
        rtolocationgrpcd: '30',
        rto_zone: 'B',
        rating_logic: '',
        campaign_id: '',
        fleet_id: '',
        discount_perc: '',
        pp_covertype_code: '',
        pp_covertype_name: '',
        pp_enddate: '',
        pp_claim_yn: '',
        pp_prev_ncb: '',
        pp_curr_ncb: '',
        addon_plan_code: 'P1',
        addon_choice_code: 'CHOICE1',
        cust_name: '',
        ab_cust_id: '',
        ab_emp_id: '',
        usr_name: 'sdfsdfdf',
        producer_code: '0015455000',
        pup_check: 'N',
        pos_panNo: '',
        pos_aadharNo: '',
        is_cust_JandK: 'NO',
        cust_pincode: '625107',
        cust_gstin: '33ASDFA2342WERW',
        tenure: '1',
        uw_discount: '0',
        Uw_DisDb: '50',
        uw_load: '',
        uw_loading_discount: '0',
        uw_loading_discount_flag: 'D',
        engine_no: '',
        chasis_no: '',
        rating_zone: 'B',
        veh_cng_lpg_insured: 'N',
        veh_type: 'indigenous',
        bodytype_desc: 'SALOON',
        veh_sub_body: '',
        goods_normally_carry: 'non-hazardous',
        odometer_reading: '1',
        trailer_under_tow: '',
        towed_by: '',
        bus_type: '',
        type_of_body: '',
        basis_of_rating: 'Underwriting Discount',
        external_built: '',
        trailer_idv: '',
        driver_nominee_name: 'asdsdsd',
        driver_nominee_age: '45',
        driver_nominee_relation: 'OTHERS',
        driver_declaration: 'ODD01',
        is_ivehicle: 'N',
        ac_opted_in_pp: 'Y'
    },
    cover: {
        C1: { opted: 'Y' },
        C2: { opted: 'Y' },
        C3: { opted: 'Y', tenure: '' },
        C4: { opted: 'N', SI: '' },
        C5: { opted: 'N', SI: '' },
        C7: { opted: 'N', SI: '' },
        C11: { opted: 'N' },
        C12: { opted: 'N' },
        C15: { opted: 'N', perc: '' },
        C18: { opted: 'N', persons: '' },
        C21: { opted: 'N', persons: '' },
        C22: { opted: 'N', persons: '' },
        C23: { opted: 'N', persons: '' },
        C24: { opted: 'N' },
        C25: { opted: 'N', SI: '', persons: '' },
        C26: { opted: 'N', SI: '', persons: '' },
        C29: { opted: 'N' },
        C35: { opted: 'N' },
        C40: { opted: 'N' },
        C53: { opted: 'N' }
    }
}

module.exports = { CvQuickQuote, Token, PostDataFunction, ProductIds, headerObject }