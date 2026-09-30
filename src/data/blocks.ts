export interface Panchayat {
  id: string;
  name: string;
  blockId: string;
}

export interface Block {
  id: string;
  name: string;
  district: string;
  center: [number, number]; // [lat, lng]
  polygon: [number, number][]; // [[lat, lng], ...] closed polygon
  panchayats: Panchayat[];
  population: number;
  farmersRegistered: number;
  primaryCrops: string[];
}

export interface District {
  id: string;
  name: string;
  blocks: string[]; // block ids
}

export const blocks: Block[] = [
  // Khordha District
  {
    id: "blk_kh_bhubaneswar",
    name: "Bhubaneswar",
    district: "dist_khordha",
    center: [20.2961, 85.8245],
    polygon: [
      [20.3461, 85.7745],
      [20.3461, 85.8745],
      [20.2461, 85.8745],
      [20.2461, 85.7745],
      [20.3461, 85.7745]
    ],
    panchayats: [
      { id: "pan_kh_bhub_1", name: "Chandrasekharpur", blockId: "blk_kh_bhubaneswar" },
      { id: "pan_kh_bhub_2", name: "Patia", blockId: "blk_kh_bhubaneswar" },
      { id: "pan_kh_bhub_3", name: "Mancheswar", blockId: "blk_kh_bhubaneswar" }
    ],
    population: 150000,
    farmersRegistered: 8500,
    primaryCrops: ["Paddy", "Vegetables"]
  },
  {
    id: "blk_kh_jatni",
    name: "Jatni",
    district: "dist_khordha",
    center: [20.1675, 85.7147],
    polygon: [
      [20.2175, 85.6647],
      [20.2175, 85.7647],
      [20.1175, 85.7647],
      [20.1175, 85.6647],
      [20.2175, 85.6647]
    ],
    panchayats: [
      { id: "pan_kh_jatni_1", name: "Kudiary", blockId: "blk_kh_jatni" },
      { id: "pan_kh_jatni_2", name: "Kantabada", blockId: "blk_kh_jatni" }
    ],
    population: 95000,
    farmersRegistered: 12400,
    primaryCrops: ["Paddy", "Green Gram", "Vegetables"]
  },
  {
    id: "blk_kh_balianta",
    name: "Balianta",
    district: "dist_khordha",
    center: [20.3735, 85.8450],
    polygon: [
      [20.4235, 85.7950],
      [20.4235, 85.8950],
      [20.3235, 85.8950],
      [20.3235, 85.7950],
      [20.4235, 85.7950]
    ],
    panchayats: [
      { id: "pan_kh_bali_1", name: "Pratapsasan", blockId: "blk_kh_balianta" },
      { id: "pan_kh_bali_2", name: "Bhingarpur", blockId: "blk_kh_balianta" }
    ],
    population: 85000,
    farmersRegistered: 11200,
    primaryCrops: ["Paddy", "Black Gram", "Vegetables"]
  },
  {
    id: "blk_kh_chilika",
    name: "Chilika",
    district: "dist_khordha",
    center: [19.8876, 85.4912],
    polygon: [
      [19.9376, 85.4412],
      [19.9376, 85.5412],
      [19.8376, 85.5412],
      [19.8376, 85.4412],
      [19.9376, 85.4412]
    ],
    panchayats: [
      { id: "pan_kh_chil_1", name: "Sorana", blockId: "blk_kh_chilika" },
      { id: "pan_kh_chil_2", name: "Nair", blockId: "blk_kh_chilika" },
      { id: "pan_kh_chil_3", name: "Bhusandapur", blockId: "blk_kh_chilika" }
    ],
    population: 78000,
    farmersRegistered: 10500,
    primaryCrops: ["Paddy", "Groundnut"]
  },

  // Cuttack District
  {
    id: "blk_cu_cuttack",
    name: "Cuttack Sadar",
    district: "dist_cuttack",
    center: [20.4625, 85.8830],
    polygon: [
      [20.5125, 85.8330],
      [20.5125, 85.9330],
      [20.4125, 85.9330],
      [20.4125, 85.8330],
      [20.5125, 85.8330]
    ],
    panchayats: [
      { id: "pan_cu_cut_1", name: "Kalarabanka", blockId: "blk_cu_cuttack" },
      { id: "pan_cu_cut_2", name: "Paramhans", blockId: "blk_cu_cuttack" }
    ],
    population: 180000,
    farmersRegistered: 15000,
    primaryCrops: ["Paddy", "Jute", "Vegetables"]
  },
  {
    id: "blk_cu_banki",
    name: "Banki",
    district: "dist_cuttack",
    center: [20.3792, 85.5272],
    polygon: [
      [20.4292, 85.4772],
      [20.4292, 85.5772],
      [20.3292, 85.5772],
      [20.3292, 85.4772],
      [20.4292, 85.4772]
    ],
    panchayats: [
      { id: "pan_cu_bank_1", name: "Baidyeswar", blockId: "blk_cu_banki" },
      { id: "pan_cu_bank_2", name: "Ostia", blockId: "blk_cu_banki" }
    ],
    population: 115000,
    farmersRegistered: 14200,
    primaryCrops: ["Paddy", "Sugarcane", "Vegetables"]
  },
  {
    id: "blk_cu_athagarh",
    name: "Athagarh",
    district: "dist_cuttack",
    center: [20.5185, 85.6318],
    polygon: [
      [20.5685, 85.5818],
      [20.5685, 85.6818],
      [20.4685, 85.6818],
      [20.4685, 85.5818],
      [20.5685, 85.5818]
    ],
    panchayats: [
      { id: "pan_cu_atha_1", name: "Gurusanga", blockId: "blk_cu_athagarh" },
      { id: "pan_cu_atha_2", name: "Radhakishorepur", blockId: "blk_cu_athagarh" }
    ],
    population: 105000,
    farmersRegistered: 13500,
    primaryCrops: ["Paddy", "Black Gram", "Groundnut"]
  },
  {
    id: "blk_cu_baramba",
    name: "Baramba",
    district: "dist_cuttack",
    center: [20.5633, 85.5481],
    polygon: [
      [20.6133, 85.4981],
      [20.6133, 85.5981],
      [20.5133, 85.5981],
      [20.5133, 85.4981],
      [20.6133, 85.4981]
    ],
    panchayats: [
      { id: "pan_cu_bara_1", name: "Gopinathpur", blockId: "blk_cu_baramba" },
      { id: "pan_cu_bara_2", name: "Maniabandha", blockId: "blk_cu_baramba" }
    ],
    population: 85000,
    farmersRegistered: 11800,
    primaryCrops: ["Paddy", "Pulses", "Sesame"]
  },

  // Puri District
  {
    id: "blk_pu_puri",
    name: "Puri Sadar",
    district: "dist_puri",
    center: [19.8135, 85.8312],
    polygon: [
      [19.8635, 85.7812],
      [19.8635, 85.8812],
      [19.7635, 85.8812],
      [19.7635, 85.7812],
      [19.8635, 85.7812]
    ],
    panchayats: [
      { id: "pan_pu_puri_1", name: "Gopalpur", blockId: "blk_pu_puri" },
      { id: "pan_pu_puri_2", name: "Balisahi", blockId: "blk_pu_puri" },
      { id: "pan_pu_puri_3", name: "Chandanpur", blockId: "blk_pu_puri" }
    ],
    population: 140000,
    farmersRegistered: 16500,
    primaryCrops: ["Paddy", "Coconut", "Groundnut"]
  },
  {
    id: "blk_pu_nimapara",
    name: "Nimapara",
    district: "dist_puri",
    center: [20.0550, 86.0099],
    polygon: [
      [20.1050, 85.9599],
      [20.1050, 86.0599],
      [20.0050, 86.0599],
      [20.0050, 85.9599],
      [20.1050, 85.9599]
    ],
    panchayats: [
      { id: "pan_pu_nima_1", name: "Tulasipur", blockId: "blk_pu_nimapara" },
      { id: "pan_pu_nima_2", name: "Balanga", blockId: "blk_pu_nimapara" }
    ],
    population: 125000,
    farmersRegistered: 15200,
    primaryCrops: ["Paddy", "Green Gram", "Vegetables"]
  },
  {
    id: "blk_pu_pipili",
    name: "Pipili",
    district: "dist_puri",
    center: [20.1172, 85.8337],
    polygon: [
      [20.1672, 85.7837],
      [20.1672, 85.8837],
      [20.0672, 85.8837],
      [20.0672, 85.7837],
      [20.1672, 85.7837]
    ],
    panchayats: [
      { id: "pan_pu_pipi_1", name: "Teisipur", blockId: "blk_pu_pipili" },
      { id: "pan_pu_pipi_2", name: "Dandamakundapur", blockId: "blk_pu_pipili" }
    ],
    population: 110000,
    farmersRegistered: 14800,
    primaryCrops: ["Paddy", "Black Gram", "Vegetables"]
  },
  {
    id: "blk_pu_konark",
    name: "Konark",
    district: "dist_puri",
    center: [19.8876, 86.0946],
    polygon: [
      [19.9376, 86.0446],
      [19.9376, 86.1446],
      [19.8376, 86.1446],
      [19.8376, 86.0446],
      [19.9376, 86.0446]
    ],
    panchayats: [
      { id: "pan_pu_kona_1", name: "Kurujanga", blockId: "blk_pu_konark" },
      { id: "pan_pu_kona_2", name: "Gop", blockId: "blk_pu_konark" }
    ],
    population: 85000,
    farmersRegistered: 10500,
    primaryCrops: ["Paddy", "Cashew", "Coconut"]
  },

  // Ganjam District
  {
    id: "blk_ga_berhampur",
    name: "Berhampur",
    district: "dist_ganjam",
    center: [19.3150, 84.7941],
    polygon: [
      [19.3650, 84.7441],
      [19.3650, 84.8441],
      [19.2650, 84.8441],
      [19.2650, 84.7441],
      [19.3650, 84.7441]
    ],
    panchayats: [
      { id: "pan_ga_berh_1", name: "Nimakhandi", blockId: "blk_ga_berhampur" },
      { id: "pan_ga_berh_2", name: "Golanthara", blockId: "blk_ga_berhampur" }
    ],
    population: 220000,
    farmersRegistered: 17500,
    primaryCrops: ["Paddy", "Vegetables", "Maize"]
  },
  {
    id: "blk_ga_chhatrapur",
    name: "Chhatrapur",
    district: "dist_ganjam",
    center: [19.3561, 84.9965],
    polygon: [
      [19.4061, 84.9465],
      [19.4061, 85.0465],
      [19.3061, 85.0465],
      [19.3061, 84.9465],
      [19.4061, 84.9465]
    ],
    panchayats: [
      { id: "pan_ga_chha_1", name: "Agastinuagam", blockId: "blk_ga_chhatrapur" },
      { id: "pan_ga_chha_2", name: "Aryapalli", blockId: "blk_ga_chhatrapur" }
    ],
    population: 95000,
    farmersRegistered: 11000,
    primaryCrops: ["Paddy", "Groundnut", "Cashew"]
  },
  {
    id: "blk_ga_aska",
    name: "Aska",
    district: "dist_ganjam",
    center: [19.6164, 84.6539],
    polygon: [
      [19.6664, 84.6039],
      [19.6664, 84.7039],
      [19.5664, 84.7039],
      [19.5664, 84.6039],
      [19.6664, 84.6039]
    ],
    panchayats: [
      { id: "pan_ga_aska_1", name: "Babanpur", blockId: "blk_ga_aska" },
      { id: "pan_ga_aska_2", name: "Kabisuryanagar", blockId: "blk_ga_aska" }
    ],
    population: 115000,
    farmersRegistered: 13800,
    primaryCrops: ["Paddy", "Sugarcane", "Black Gram"]
  },
  {
    id: "blk_ga_khallikote",
    name: "Khallikote",
    district: "dist_ganjam",
    center: [19.5534, 85.0786],
    polygon: [
      [19.6034, 85.0286],
      [19.6034, 85.1286],
      [19.5034, 85.1286],
      [19.5034, 85.0286],
      [19.6034, 85.0286]
    ],
    panchayats: [
      { id: "pan_ga_khal_1", name: "Bhejiput", blockId: "blk_ga_khallikote" },
      { id: "pan_ga_khal_2", name: "Rambha", blockId: "blk_ga_khallikote" }
    ],
    population: 88000,
    farmersRegistered: 10400,
    primaryCrops: ["Paddy", "Cashew", "Groundnut"]
  },

  // Kalahandi District
  {
    id: "blk_ka_bhawanipatna",
    name: "Bhawanipatna",
    district: "dist_kalahandi",
    center: [19.9071, 83.1668],
    polygon: [
      [19.9571, 83.1168],
      [19.9571, 83.2168],
      [19.8571, 83.2168],
      [19.8571, 83.1168],
      [19.9571, 83.1168]
    ],
    panchayats: [
      { id: "pan_ka_bhaw_1", name: "Bordha", blockId: "blk_ka_bhawanipatna" },
      { id: "pan_ka_bhaw_2", name: "Medinipur", blockId: "blk_ka_bhawanipatna" }
    ],
    population: 135000,
    farmersRegistered: 18000,
    primaryCrops: ["Paddy", "Cotton", "Pigeon Pea"]
  },
  {
    id: "blk_ka_junagarh",
    name: "Junagarh",
    district: "dist_kalahandi",
    center: [19.8594, 83.0238],
    polygon: [
      [19.9094, 82.9738],
      [19.9094, 83.0738],
      [19.8094, 83.0738],
      [19.8094, 82.9738],
      [19.9094, 82.9738]
    ],
    panchayats: [
      { id: "pan_ka_juna_1", name: "Chiliguda", blockId: "blk_ka_junagarh" },
      { id: "pan_ka_juna_2", name: "Mahichala", blockId: "blk_ka_junagarh" }
    ],
    population: 105000,
    farmersRegistered: 14500,
    primaryCrops: ["Paddy", "Cotton", "Maize"]
  },
  {
    id: "blk_ka_kesinga",
    name: "Kesinga",
    district: "dist_kalahandi",
    center: [20.1835, 83.2152],
    polygon: [
      [20.2335, 83.1652],
      [20.2335, 83.2652],
      [20.1335, 83.2652],
      [20.1335, 83.1652],
      [20.2335, 83.1652]
    ],
    panchayats: [
      { id: "pan_ka_kesi_1", name: "Balsi", blockId: "blk_ka_kesinga" },
      { id: "pan_ka_kesi_2", name: "Utkela", blockId: "blk_ka_kesinga" }
    ],
    population: 95000,
    farmersRegistered: 12200,
    primaryCrops: ["Paddy", "Pulses", "Vegetables"]
  },
  {
    id: "blk_ka_dharamgarh",
    name: "Dharamgarh",
    district: "dist_kalahandi",
    center: [19.9483, 83.3728],
    polygon: [
      [19.9983, 83.3228],
      [19.9983, 83.4228],
      [19.8983, 83.4228],
      [19.8983, 83.3228],
      [19.9983, 83.3228]
    ],
    panchayats: [
      { id: "pan_ka_dhar_1", name: "Parla", blockId: "blk_ka_dharamgarh" },
      { id: "pan_ka_dhar_2", name: "Behera", blockId: "blk_ka_dharamgarh" }
    ],
    population: 110000,
    farmersRegistered: 15300,
    primaryCrops: ["Paddy", "Cotton", "Groundnut"]
  },

  // Mayurbhanj District
  {
    id: "blk_ma_baripada",
    name: "Baripada",
    district: "dist_mayurbhanj",
    center: [21.9322, 86.7248],
    polygon: [
      [21.9822, 86.6748],
      [21.9822, 86.7748],
      [21.8822, 86.7748],
      [21.8822, 86.6748],
      [21.9822, 86.6748]
    ],
    panchayats: [
      { id: "pan_ma_bari_1", name: "Manitri", blockId: "blk_ma_baripada" },
      { id: "pan_ma_bari_2", name: "Kuabuda", blockId: "blk_ma_baripada" }
    ],
    population: 160000,
    farmersRegistered: 19000,
    primaryCrops: ["Paddy", "Maize", "Mustard"]
  },
  {
    id: "blk_ma_rairangpur",
    name: "Rairangpur",
    district: "dist_mayurbhanj",
    center: [22.2529, 86.1696],
    polygon: [
      [22.3029, 86.1196],
      [22.3029, 86.2196],
      [22.2029, 86.2196],
      [22.2029, 86.1196],
      [22.3029, 86.1196]
    ],
    panchayats: [
      { id: "pan_ma_rair_1", name: "Asana", blockId: "blk_ma_rairangpur" },
      { id: "pan_ma_rair_2", name: "Gorumahisani", blockId: "blk_ma_rairangpur" }
    ],
    population: 105000,
    farmersRegistered: 13500,
    primaryCrops: ["Paddy", "Maize", "Vegetables"]
  },
  {
    id: "blk_ma_udala",
    name: "Udala",
    district: "dist_mayurbhanj",
    center: [21.5765, 86.5528],
    polygon: [
      [21.6265, 86.5028],
      [21.6265, 86.6028],
      [21.5265, 86.6028],
      [21.5265, 86.5028],
      [21.6265, 86.5028]
    ],
    panchayats: [
      { id: "pan_ma_udal_1", name: "Bahubandh", blockId: "blk_ma_udala" },
      { id: "pan_ma_udal_2", name: "Khaladi", blockId: "blk_ma_udala" }
    ],
    population: 95000,
    farmersRegistered: 12100,
    primaryCrops: ["Paddy", "Pulses", "Sesame"]
  },
  {
    id: "blk_ma_karanjia",
    name: "Karanjia",
    district: "dist_mayurbhanj",
    center: [21.7742, 86.1167],
    polygon: [
      [21.8242, 86.0667],
      [21.8242, 86.1667],
      [21.7242, 86.1667],
      [21.7242, 86.0667],
      [21.8242, 86.0667]
    ],
    panchayats: [
      { id: "pan_ma_kara_1", name: "Mirigochha", blockId: "blk_ma_karanjia" },
      { id: "pan_ma_kara_2", name: "Tato", blockId: "blk_ma_karanjia" }
    ],
    population: 85000,
    farmersRegistered: 10800,
    primaryCrops: ["Paddy", "Maize", "Pigeon Pea"]
  }
];

export const districts: District[] = [
  {
    id: "dist_khordha",
    name: "Khordha",
    blocks: ["blk_kh_bhubaneswar", "blk_kh_jatni", "blk_kh_balianta", "blk_kh_chilika"]
  },
  {
    id: "dist_cuttack",
    name: "Cuttack",
    blocks: ["blk_cu_cuttack", "blk_cu_banki", "blk_cu_athagarh", "blk_cu_baramba"]
  },
  {
    id: "dist_puri",
    name: "Puri",
    blocks: ["blk_pu_puri", "blk_pu_nimapara", "blk_pu_pipili", "blk_pu_konark"]
  },
  {
    id: "dist_ganjam",
    name: "Ganjam",
    blocks: ["blk_ga_berhampur", "blk_ga_chhatrapur", "blk_ga_aska", "blk_ga_khallikote"]
  },
  {
    id: "dist_kalahandi",
    name: "Kalahandi",
    blocks: ["blk_ka_bhawanipatna", "blk_ka_junagarh", "blk_ka_kesinga", "blk_ka_dharamgarh"]
  },
  {
    id: "dist_mayurbhanj",
    name: "Mayurbhanj",
    blocks: ["blk_ma_baripada", "blk_ma_rairangpur", "blk_ma_udala", "blk_ma_karanjia"]
  }
];

export const getBlockById = (id: string): Block | undefined => {
  return blocks.find(b => b.id === id);
};

export const getBlocksByDistrict = (districtId: string): Block[] => {
  return blocks.filter(b => b.district === districtId);
};
