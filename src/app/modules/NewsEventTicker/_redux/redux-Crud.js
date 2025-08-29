import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createHoliday(body) {

  return axios.post(`${USERS_URL}/news_event_ticker/create-news-event-ticker`, body);
  
}


// Read
export function getAllHoliday(body) {

  return axios.post(`${USERS_URL}/news_event_ticker/read-all-news-event-ticker`, body);
}

export function getHolidayById(id) {

  return axios.get(`${USERS_URL}/news_event_ticker/read-news-event-ticker/${id}`);
}

//Update
export function updateHoliday(body) {
   
  return axios.put(`${USERS_URL}/news_event_ticker/update-news-event-ticker`, body);
}

//Delete
export function deleteHoliday(Id) {

  return axios.delete(`${USERS_URL}/news_event_ticker/delete-news-event-ticker/${Id}`);
}
