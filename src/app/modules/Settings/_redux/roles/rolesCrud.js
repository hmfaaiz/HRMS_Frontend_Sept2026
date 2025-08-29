import axios from "axios"
import { USERS_URL } from "../../../UserMangement/_redux/usersCrud"

export const ROLES_URL = process.env.REACT_APP_API_URL

export function createRole(role) {
  return axios.post(`${ROLES_URL}/settings/create-role`, role)  
}
// Read
export function getAllRoles(body) {
  return axios.post(`${ROLES_URL}/settings/read-all-roles`, body)
}

//Delete Role
export function deleteRole(roleId) {
  return axios.patch(`${ROLES_URL}/settings/delete-role`, roleId)
}

export function updateRole(role){
  return axios.put(`${USERS_URL}/settings/update-role`, role)
}

export function getRoleById(id){

  return axios.post(`${USERS_URL}/settings/read-role`, id)
}

export function getAllAccessRights(body){

  return axios.post(`${USERS_URL}/settings/read-all-accessrights`, body)

}

export function updateAccessRightByRoleAndResourceId(body){

  return axios.put(`${USERS_URL}/settings/update-accessright`, body)

}