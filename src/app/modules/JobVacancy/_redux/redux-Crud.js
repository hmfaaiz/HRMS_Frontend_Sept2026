import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createJobVacancy(body) {

  return axios.post(`${USERS_URL}/job_vacancy/create-job-vacancy`, body);
  
}


// Read
export function getAllJobVacancy(body) {


  const config = {
    responseType: (body?.pdf || body?.excel  || body?.csv) ? 'arraybuffer' : 'json', 
  };
 return axios.post(`${USERS_URL}/job_vacancy/read-all-job-vacancy`, body, config);
}

export function getJobVacancyById(id) {

  return axios.post(`${USERS_URL}/job_vacancy/read-job-vacancy`, id);
}

//Update
export function updateJobVacancy(body) {
   
  return axios.put(`${USERS_URL}/job_vacancy/update-job-vacancy`, body);
}

//Delete
export function deleteJobVacancy(body) {

  return axios.patch(`${USERS_URL}/job_vacancy/delete-job-vacancy`, body);
}

//Post
export function postJobVacancy(body) {

  return axios.patch(`${USERS_URL}/job_vacancy/post-job-vacancy`, body);
}


//Hold
export function holdJobVacancy(body) {

  return axios.patch(`${USERS_URL}/job_vacancy/hold-job-vacancy`, body);
}


//Close
export function closeJobVacancy(body) {

  return axios.patch(`${USERS_URL}/job_vacancy/close-job-vacancy`, body);
}
export function fetchApplicantsForVacancy(jobVacancyId) {
  return axios
    .post(`${USERS_URL}/applicant_profile/read-all-applicant-profile`, {
      pageSize: 1000,
      pageNumber: 1,
      filter: {},
    })
    .then((res) => {
      const all = res.data?.data?.rows || [];
      return all.filter((applicant) =>
        (applicant.details_applicant_vacancy || []).some(
          (v) => v.jobVacancyId === parseInt(jobVacancyId)
        )
      );
    });
}

export function generateJobVacancyReportRequest(jobVacancyId) {
  return axios.post(
    `${USERS_URL}/job_vacancy/read-all-job-vacancy`,
    { vacancyReport: jobVacancyId },   
    { responseType: "arraybuffer" }
  );
}
