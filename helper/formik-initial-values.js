import { add, format, subYears, subMonths } from 'date-fns';

export const bikeBuyNowInitialValue = (values) => {
  let policy_duration_cal = '';

  if (values.policy_expire_date) {
    let start_date = add(new Date(values?.policy_expire_date), {
      days: 3,
    }).toLocaleDateString();
    start_date = format(new Date(start_date), 'yyyy-MM-dd');

    let end_date = add(new Date(start_date), { years: 1 }).toLocaleDateString();
    end_date = format(new Date(end_date), 'yyyy-MM-dd');

    policy_duration_cal = `${start_date} - ${end_date}`;
  }

  const initialValues = {
    c_idv: values?.addons?.c_idv ? values?.addons?.c_request_idv : 0,
    c_make_model: values?.c_make_model ? values?.c_make_model : 'NA',
    c_rto_location: values?.c_place_of_registration ? values?.c_place_of_registration : 'NA',
    c_registration_date: values?.c_registration_date ? new Date(values.c_registration_date).toLocaleDateString('en-CA') : 'NA',
    c_registration_number: values?.c_registration_number ? values?.c_registration_number : '',
    c_policy_tenure: values?.c_policy_tenure ? values?.c_policy_tenure : 'NA',
    c_prev_policy_expire_date: values?.c_prev_policy_expire_date ? new Date(values.c_prev_policy_expire_date).toLocaleDateString('en-CA') : 'NA',
    c_electrical_accessories: values?.addons?.c_electrical_accessories ? values?.addons?.c_electrical_accessories : '0',
    c_non_electrical_accessories: values?.addons?.c_non_electrical_accessories ? values?.addons?.c_non_electrical_accessories : '0',
    c_ncb: values?.c_ncb ? values.c_ncb : '0',
    c_voluntary_excess: values?.addons?.c_voluntary_excess ? values.addons?.c_voluntary_excess : 'No',
    c_anti_theif: values?.addons?.c_anti_theif ? values?.addons?.c_anti_theif : 'No',
    c_aa_membership: values?.c_aa_membership ? values.c_aa_membership : 'No',
    c_tppd: values?.addons?.c_limit_tp_damage === 'true' || true ? 'Yes' : 'No',
    c_title: values?.c_title ? values.c_title : '',
    c_first_name: values?.c_full_name ? values.c_full_name : '',
    c_last_name: values?.c_last_name ? values?.c_last_name : '',
    c_dob: values?.c_dob ? values?.c_dob : subYears(new Date(), 18),
    c_maritial_status: values?.c_maritial_status ? values?.c_maritial_status : '',
    c_aadhar_number: values?.c_aadhar_number ? values?.c_aadhar_number : '',
    c_gender: values?.c_gender ? values?.c_gender : '',
    c_gst_number: values?.c_gst_number ? values?.c_gst_number : '',
    c_mobile: values?.c_mobile ? values?.c_mobile : '',
    c_email: values?.c_email ? values?.c_email : '',
    // c_cpa: values?.c_cpa ? values?.c_cpa : '',
    c_address_line1: values?.c_address_line1 ? values?.c_address_line1 : '',
    c_address_line2: values?.c_address_line2 ? values?.c_address_line2 : '',
    c_address_line3: values?.c_address_line3 ? values?.c_address_line3 : '',
    c_pincode: values?.c_pincode ? values.c_pincode : '',
    c_city: values?.c_city ? values?.c_city : '',
    c_state: values?.c_state ? values?.c_state : '',
    c_engine_number: values?.c_engine_number ? values?.c_engine_number : '',
    c_chassis_number: values?.c_chassis_number ? values?.c_chassis_number : '',
    c_prev_policy_number: values?.c_prev_policy_number ? values?.c_prev_policy_number : '',
    c_vehicle_colour: values?.c_vehicle_colour ? values?.c_vehicle_colour : '',
    c_is_vehicle_financed: values?.c_is_vehicle_financed ? values?.c_is_vehicle_financed : '',
    c_valid_pucc: values?.c_valid_pucc ? values?.c_valid_pucc : '',
    c_pucc_number: values.c_pucc_number ? values.c_pucc_number : '',
    c_pucc_valid_date: values.c_pucc_valid_date ? values.c_pucc_valid_date : '',
    c_nominee_relation: values?.c_nominee_relation ? values?.c_nominee_relation : '',
    c_nominee_full_name: values?.c_nominee_full_name ? values?.c_nominee_full_name : '',
    c_nominee_dob: values?.c_nominee_dob ? values?.c_nominee_dob : subYears(new Date(), 18),
    c_financier_name: values?.c_financier_name ? values.c_financier_name : '',
    c_financier_type: values?.c_financier_type ? values?.c_financier_type : '',
    c_company_name: values?.c_company_name ? values?.c_company_name : '',
    c_pan_number: values?.c_pan_number ? values?.c_pan_number : '',
  };

  const testvalues = {
    c_idv: values?.c_idv ? values.c_idv : 'NA',
    c_make_model: values?.c_make_model ? values.c_make_model : 'NA',
    c_rto_details: values?.c_rto_details ? values.c_rto_details : 'NA',
    c_registration_date: values?.c_registration_date ? values.c_registration_date : 'NA',
    // c_registration_number: '',
    c_policy_tenure: values?.c_policy_tenure ? values?.c_policy_tenure : 'NA',
    // c_prev_policy_expire_date: values?.polc_prev_policy_expire_dateicy_expire_date ? values.policy_expire_date : 'NA',
    c_electrical_accessories: values?.c_electrical_accessories ? values.c_electrical_accessories : 'NA',
    c_non_electrical_accessories: values?.c_non_electrical_accessories ? values.c_non_electrical_accessories : 'NA',
    c_ncb: values?.c_ncb ? values.c_ncb : 'NA',
    c_voluntary_excess: values?.c_voluntary_excess ? values.c_voluntary_excess : 'NA',
    c_anti_theif: values?.c_anti_theif ? values.c_anti_theif : 'NA',
    c_aa_membership: values?.c_aa_membership ? values.c_aa_membership : 'NA',
    c_tppd: values?.c_limit_tp_damage === 'true' || true ? 'Yes' : 'No',
    c_title: 'mr',
    c_first_name: values?.c_full_name ? values.c_full_name : '',
    c_last_name: 'bhargav',
    c_dob: '1997-02-23',
    c_maritial_status: 'married',
    c_aadhar_number: '266665093575',
    c_gender: 'male',
    c_gst_number: '55666985545112',
    c_mobile: values?.c_mobile ? values.c_mobile : '',
    c_email: values?.c_email ? values.c_email : '',
    c_cpa: 'hired_driver',
    c_address_line1: 'hyderabad',
    c_address_line2: 'hyderabad',
    c_address_line3: 'hyderabad',
    c_pincode: '500039',
    c_city: 'hyderabad',
    c_state: 'telangana',
    c_registration_number: 'MH01EM9099',
    c_engine_number: 'JF39E70321656',
    c_chassis_number: 'ME4KC093A98040032',
    c_prev_policy_number: '897745632',
    c_vehicle_colour: 'blue',
    c_is_vehicle_financed: 'no',
    c_valid_pucc: 'no',
    c_nominee_relation: 'spouse',
    c_nominee_full_name: 'priyanka',
    c_nominee_dob: '1997-02-01',
    c_financier_name: '',
  };

  return initialValues;
  // return testvalues;
};

export function bikeInsuranceInitialValues(values) {
  const value = Object.values(values);
  if (values.c_manufacture_year_month) {
    const year = parseInt(values.c_manufacture_year_month.split('/')[1]);
    const month = parseInt(values.c_manufacture_year_month.split('/')[0]) - 1;
  }
  const initialValues = {
    c_customer_type: 'I',
    c_plan: 'TP-1-OD-1',
    c_make: value.length > 0 ? values.c_make : '',
    c_model: value.length > 0 ? values.c_model : '',
    c_variant: value.length > 0 ? values.c_variant : '',
    c_registration_date: value.length > 0 ? values.c_registartion_date : subYears(new Date(), 1),
    c_place_of_registration: value.length > 0 ? values.c_place_of_registration : '',
    c_manufacture_year_month: value.length > 0 ? (values.c_manufacture_year_month.length === 6 ? new Date(year, month, 1).toLocaleDateString('en-CA') : values.c_manufacture_year_month) : subYears(new Date(), 1),
    c_existing_policy: true,
    c_prev_policy_expire_date: value.length > 0 ? new Date() : new Date(),
    c_prev_insurer: value.length > 0 ? values.c_prev_insurer : '',
    c_claim_last_year: false,
    c_ncb: value.length > 0 ? values.c_ncb : '',
    c_full_name: value.length > 0 ? values.c_full_name : '',
    c_mobile: value.length > 0 ? values.c_full_name : '',
    c_email: value.length > 0 ? values.c_email : '',
    c_fuel_type: value.length > 0 ? values.c_fuel_type : '',
    c_tp_previous_insurer: value.length > 0 ? values.c_tp_previous_insurer : '',
    c_address_line1: value.length > 0 ? values.c_address_line1 : '',
    c_chassis_number: value.length > 0 ? values.c_chassis_number : '',
    c_colour: value.length > 0 ? values.c_colour : '',
    c_engine_number: value.length > 0 ? values.c_engine_number : '',
    c_financed: value.length > 0 ? values.c_financed : '',
    c_prev_policy_number: value.length > 0 ? value.c_prev_policy_number : '',
  };

  return initialValues;
}

export function newBikeInsuranceInitialValues(values) {
  const value = values ? Object.values(values) : '';
  const year = new Date().getFullYear();
  const month = new Date().getMonth();
  const initialValues = {
    c_customer_type: 'I',
    c_plan: 'TP-5-OD-1',
    c_make: value.length > 0 ? values.c_make : '',
    c_model: value.length > 0 ? values.c_model : '',
    c_variant: value.length > 0 ? values.c_variant : '',
    c_registration_date: value.length > 0 ? values.c_registartion_date : new Date(),
    c_place_of_registration: value.length > 0 ? values.c_place_of_registration : '',
    c_manufacture_year_month: value.length > 0 ? values.c_manufacture_year_month : subMonths(new Date(year, month, 1), 1),
    c_full_name: value.length > 0 ? values.c_full_name : '',
    c_mobile: value.length > 0 ? values.c_full_name : '',
    c_email: value.length > 0 ? values.c_full_name : '',
    c_fuel_type: value.length > 0 ? values.c_fuel_type : '',
  };
  return initialValues;
}

export function carInsuranceInitialValues(values) {
  const value = Object.values(values);
  const year = new Date().getFullYear();
  const month = new Date().getMonth();
  const initialValues = {
    c_customer_type: 'I',
    c_plan: 'TP-1-OD-1',
    c_make: value.length > 0 ? values.c_make : '',
    c_model: value.length > 0 ? values.c_model : '',
    c_variant: value.length > 0 ? values.c_variant : '',
    c_registration_date: value.length > 0 ? values.c_registartion_date : subYears(new Date(), 1),
    c_place_of_registration: value.length > 0 ? values.c_place_of_registration : '',
    c_manufacture_year_month: value.length > 0 ? values.c_manufacture_year_month : subYears(new Date(year, month, 1), 1),
    c_existing_policy: true,
    c_prev_policy_expire_date: value.length > 0 ? new Date() : new Date(),
    c_prev_insurer: value.length > 0 ? values.c_prev_insurer : '',
    c_claim_last_year: false,
    c_ncb: value.length > 0 ? values.c_ncb : '',
    c_full_name: value.length > 0 ? values.c_full_name : '',
    c_mobile: value.length > 0 ? values.c_full_name : '',
    c_email: value.length > 0 ? values.c_full_name : '',
    c_fuel_type: value.length > 0 ? values.c_fuel_type : '',
    c_tp_previous_insurer: value.length > 0 ? values.c_tp_previous_insurer : '',
    c_address_line1: value.length > 0 ? values.c_address_line1 : '',
    c_chassis_number: value.length > 0 ? values.c_chassis_number : '',
    c_colour: value.length > 0 ? values.c_colour : '',
    c_engine_number: value.length > 0 ? values.c_engine_number : '',
    c_financed: value.length > 0 ? values.c_financed : '',
    c_prev_policy_number: value.length > 0 ? value.c_prev_policy_number : '',
  };

  return initialValues;
}

export function newCarInsuranceInitialValues(values) {
  const value = values ? Object.values(values) : '';
  const initialValues = {
    c_customer_type: 'I',
    c_plan: 'TP-3-OD-1',
    c_make: value.length > 0 ? values.c_make : '',
    c_model: value.length > 0 ? values.c_model : '',
    c_variant: value.length > 0 ? values.c_variant : '',
    c_registration_date: value.length > 0 ? values.c_registartion_date : new Date(),
    c_place_of_registration: value.length > 0 ? values.c_place_of_registration : '',
    c_manufacture_year_month: value.length > 0 ? values.c_manufacture_year_month : new Date(),
    c_full_name: value.length > 0 ? values.c_full_name : '',
    c_mobile: value.length > 0 ? values.c_full_name : '',
    c_email: value.length > 0 ? values.c_email : '',
    c_fuel_type: value.length > 0 ? values.c_fuel_type : '',
  };
  return initialValues;
}

export const newBikeInsuranceRadios = {
  companyArray: [
    {
      displayValue: 'Company',
      inputValue: 'C',
      uniqueName: 'companyValue1',
    },
    {
      displayValue: 'Individual',
      inputValue: 'I',
      uniqueName: 'companyValue2',
    },
  ],
  planArray: [
    {
      displayValue: 'O.D 1 Yr + T.P 5 Yr',
      inputValue: 'TP-5-OD-1',
      uniqueName: 'TP-5-OD-1',
    },
    {
      displayValue: 'O.D 3 Yr + T.P 5 Yr',
      inputValue: 'TP-5-OD-3',
      uniqueName: 'TP-5-OD-3',
    },
    {
      displayValue: 'O.D 5 Yr + T.P 5 Yr',
      inputValue: 'TP-5-OD-5',
      uniqueName: 'TP-5-OD-5',
    },
  ],
};

export const AddonsInitialValues = ({ addons }) => {
  const initialValues = {
    c_request_idv: addons?.c_request_idv !== undefined ? addons.c_request_idv : 0,
    c_pa_cover_owner_driver: addons?.c_pa_cover_owner_driver !== undefined ? addons.c_pa_cover_owner_driver : false,
    c_limit_tp_damage: addons?.c_limit_tp_damage !== undefined ? addons.c_limit_tp_damage : false,
    c_pa_unnamed_passenger: addons?.c_pa_unnamed_passenger !== undefined ? addons.c_pa_unnamed_passenger : 0,
    c_legal_liability_pd: addons?.c_legal_liability_pd !== undefined ? addons.c_legal_liability_pd : false,
    c_electrical_accessories: addons?.c_electrical_accessories !== undefined ? addons.c_electrical_accessories : 0,
    c_non_electrical_accessories: addons?.c_non_electrical_accessories !== undefined ? addons.c_non_electrical_accessories : 0,
    c_anti_theif: addons?.c_anti_theif !== undefined ? addons.c_anti_theif : false,
    c_voluntary_excess: addons?.c_voluntary_excess !== undefined ? addons.c_voluntary_excess : 0,
  };
  return initialValues;
};

export const PosSignupInitialValues = () => {
  const initialValues = {
    first_name: '',
    last_name: '',
    mobile_number: '',
    email: '',
    aadhar_number: '',
    pan_number: '',
    bank_name: '',
    account_number: '',
    bank_branch_name: '',
    ifsc_code: '',
  };
  return initialValues;
};

export const PosLoginInitialValues = () => {
  const initialValues = {
    username: '',
    password: '',
  };
};
