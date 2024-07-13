import HomeBanner from 'public/home-hero.jpg';
import carInsurance from 'public/car-insurance.svg';
import bikeInsurance from 'public/bike-insurance.svg';
import healthInsurance from 'public/health-insurance.svg';

export const quotationSortingOptions = [
  {
    display: 'Premium Low to High',
    value: 'P-L-H',
  },
  {
    display: 'Premium High to Low',
    value: 'P-H-L',
  },
  {
    display: 'IDV Low to High',
    value: 'IDV-L-H',
  },
  {
    display: 'IDV High to Low',
    value: 'IDV-H-L',
  },
];

export const options = [
  { displayName: 'YES', displayValue: true },
  { displayName: 'NO', displayValue: false },
];

export const unNamedPassengers = [
  { displayName: 'NO', displayValue: 0 },
  { displayName: '50000', displayValue: 50000 },
  { displayName: '100000', displayValue: 100000 },
  { displayName: '200000', displayValue: 200000 },
];

export const voluntryExcess = [
  { displayName: 'NO', displayValue: 0 },
  { displayName: '2500', displayValue: 2500 },
  { displayName: '5000', displayValue: 5000 },
  { displayName: '7500', displayValue: 7500 },
  { displayName: '15000', displayValue: 15000 },
];

export const customerTypeOptions = [
  { displayName: 'Company', displayValue: 'C' },
  { displayName: 'Individual', displayValue: 'I' },
];

export const planTypesForRolloverBikeInsurance = [
  { displayName: 'TP only for 1Yr', displayValue: 'TP-1-OD-0' },
  { displayName: 'OD only for 1Yr', displayValue: 'TP-0-OD-1' },
  { displayName: 'TP + OD for 1Yr', displayValue: 'TP-1-OD-1' },
  { displayName: 'TP + OD for 2Yr', displayValue: 'TP-2-OD-2' },
  { displayName: 'TP + OD for 3Yr', displayValue: 'TP-3-OD-3' },
];

export const insuranceExistingFields = [
  { displayName: 'Yes', displayValue: true },
  { displayName: 'No', displayValue: false },
];

export const planTypesForRolloverCarInsurance = [
  { displayName: 'TP only for 1Yr', displayValue: 'TP-1-OD-0' },
  { displayName: 'OD only for 1Yr', displayValue: 'TP-0-OD-1' },
  { displayName: 'Comprehensive Plan for 1Yr', displayValue: 'TP-1-OD-1' },
];

export const planTypesForCarInsurance = [
  { displayName: 'TP only for 3Yr', displayValue: 'TP-3-OD-0' },
  { displayName: 'TP for 3Yr + OD for 1Yr', displayValue: 'TP-3-OD-1' },
];

export const planTypesForBikeInsurance = [
  { displayName: 'TP for 5Yr + OD for 1Yr', displayValue: 'TP-5-OD-1' },
  { displayName: 'TP for 5Yr + OD for 3Yr', displayValue: 'TP-5-OD-3' },
  { displayName: 'TP for 5Yr + OD for 5Yr', displayValue: 'TP-5-OD-5' },
];

export const ncbValues = [
  { displayName: '0', displayValue: 0 },
  { displayName: '20', displayValue: 20 },
  { displayName: '25', displayValue: 25 },
  { displayName: '35', displayValue: 35 },
  { displayName: '45', displayValue: 45 },
  { displayName: '50', displayValue: 50 },
];

export const productItems = [
  { link: '/bike-insurance', image: bikeInsurance, about: 'Bike Insurance' },
  { link: '/car-insurance', image: carInsurance, about: 'Car Insurance' },
  { link: '/health-insurance', image: healthInsurance, about: 'Health Insurance' },
];

export const posProductItems = [
  { link: '/pos/bike-insurance', image: bikeInsurance, about: 'Bike Insurance' },
  { link: '/pos/car-insurance', image: carInsurance, about: 'Car Insurance' },
  { link: '/pos/health-insurance', image: healthInsurance, about: 'Health Insurance' },
];

export const AddonsResetValues = () => {
  const initialValues = {
    c_request_idv: 0,
    c_anti_theifiver: false,
    c_limit_tp_damage: false,
    c_pa_unnamed_passenger: 0,
    c_legal_liability_pd: false,
    c_electrical_accessories: 0,
    c_non_electrical_accessories: 0,
    c_anti_theif_device: false,
    c_voluntary_excess: 0,
  };
  return initialValues;
};

export const SideNavMenuItems = [
  {
    subMenu: 'Products',
    menuItem: [
      { menu: 'Bike Insurance', links: '/pos/bike-insurance' },
      { menu: 'Car Insurance', links: '/pos/car-insurance' },
    ],
  },
  { menuItem: [{ menu: 'Customer Reports', links: '/pos/customers' }] },
  { menuItem: [{ menu: 'Renewal Reports', links: '/pos' }] },
  { menuItem: [{ menu: 'Policy Reports', links: '/pos' }] },
  { menuItem: [{ menu: 'Claim Reports', links: '/pos' }] },
  { menuItem: [{ menu: 'Status of Insurance', links: '/pos' }] },
  { menuItem: [{ menu: 'Pending Policies', links: '/pos' }] },
  { menuItem: [{ menu: 'Settings', links: '/pos' }] },
];

// menuItem: ['Life Insurance', 'Health Insurance', 'Travel Insurance', 'Bike Insurance', 'Car Insurance', 'Commercial Vehicles']
