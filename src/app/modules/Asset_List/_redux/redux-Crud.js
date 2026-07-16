// import axios from "axios";

// export const USERS_URL = process.env.REACT_APP_API_URL;

// /**
//  * Get All Asset List Data Paginated
//  * @param {Object} body
//  * @returns res
//  */
// export async function getAllAssetListSetup(body) {
//   return axios.post(`${USERS_URL}/asset_list/read-all-asset-list`, body);
// }

// /**
//  * Get All Asset List Data For Pdf
//  * @param {Object} body
//  * @returns res
//  */
// export async function getAllAssetListForPdf(body) {
//   return axios.post(
//     `${USERS_URL}/asset_list/read-all-asset-list-pdf-data`,
//     body,
//     {
//       responseType: "arraybuffer",
//     },
//   );
// }

// export async function generateExcel(body) {
//   return axios.post(`${USERS_URL}/asset_list/read-all-asset-list-excel`, body, {
//     responseType: "arraybuffer",
//   });
// }


import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

/**
 * Get All Asset List Data Paginated
 * @param {Object} body
 * @returns res
 */
export async function getAllAssetListSetup(body) {
  return axios.post(`${USERS_URL}/asset_list/read-all-asset-list`, body);
}

/**
 * Get All Asset List Data For Pdf
 * @param {Object} body
 * @returns res
 */
export async function getAllAssetListForPdf(body) {
  return axios.post(
    `${USERS_URL}/asset_list/read-all-asset-list-pdf-data`,
    body,
    {
      responseType: "arraybuffer",
    },
  );
}

export async function generateExcel(body) {
  return axios.post(`${USERS_URL}/asset_list/read-all-asset-list-excel`, body, {
    responseType: "arraybuffer",
  });
}

/**
 * @param {Object} body
 * @returns res
 */
export async function getAssetModelOptions(body) {
  return axios.post(`${USERS_URL}/asset_list/asset-model-options`, body);
}