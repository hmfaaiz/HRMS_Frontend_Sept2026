import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

// Read
export function getAllAppraisalPublish(body) {
  return axios.post(
    `${USERS_URL}/appraisal_publish/read-all-appraisal-publish`,
    body
  );
}

// publish Appraisal
export function publishAppraisal(body) {
  return axios.post(`${USERS_URL}/appraisal_publish/publish-appraisal`, body);
}

// hold Appraisal publishing
export function holdAppraisalPublish(id) {
  return axios.post(
    `${USERS_URL}/appraisal_publish/hold-appraisal-publish`,
    id
  );
}

//Delete
export function deleteAppraisalPublish(body) {
  return axios.patch(
    `${USERS_URL}/appraisal_publish/delete-appraisal-publish`,
    body
  );
}

// view appraisal detail
export function viewAppraisalDetail(body) {
  return axios.post(
    `${USERS_URL}/appraisal_publish/view-appraisal-detail`,
    body
  );
}

export function getAppraisalPublishReport(body) {
  const config = {
    responseType: "arraybuffer",
  };
  return axios.post(
    `${USERS_URL}/appraisal_publish/appraisal-Publishing-Report`,
    body,
    config
  );
}

