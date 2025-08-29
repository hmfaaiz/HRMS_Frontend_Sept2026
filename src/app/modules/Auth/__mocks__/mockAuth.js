import {
  LOGIN_URL,
  // ME_URL,
  REGISTER_URL,
  REQUEST_PASSWORD_URL,
} from "../_redux/authCrud"
import userTableMock from "./userTableMock"

// const LOGIN_URL = {
//   code: 201,
//   message: "Successfully Created",
//   data: {
//     user: {
//       id: 1,
//       firstname: "Arsalan",
//       lastname: "Ahmed",
//       username: "ArsalanAhmed",
//       email: "arsalanahmed.dev@gmail.com",
//       password: "demo",
//       cnic: "42847827894375",
//       phNo: "03333078584",
//       isActive: true,
//       createdBy: null,
//       updatedBy: null,
//       createdAt: null,
//       updatedAt: null,
//       roleId: 1,
//     },
//     tokens: {
//       access:
//         "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTY1ODMwMTMxNiwiZXhwIjoxNjU4NDgxMzE2LCJ0eXBlIjoiYWNjZXNzIn0.PFTtXMb4s-0Mp1dkQWDvfvgiexCidruIwZfs9IQjE9s",
//       refresh:
//         "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTY1ODMwMTMxNiwiZXhwIjoxOTE3NTAxMzE2LCJ0eXBlIjoicmVmcmVzaCJ9.Hc1kPB7z9CNB6z0NjkVTMAdyQQ9ZfAb3tt8FZqwJtZw",
//     },
//     userAccess: [
//       {
//         isAccess: true,
//         isActive: true,
//         roleId: 1,
//         resourceId: 2,
//         T_ROLE: {
//           name: "Super Admin",
//           slug: "super-admin",
//         },
//         T_RESOURCE: {
//           name: "Edit User",
//           parentName: "Users",
//           slug: "update-user",
//         },
//       },
//       {
//         isAccess: true,
//         isActive: true,
//         roleId: 1,
//         resourceId: 4,
//         T_ROLE: {
//           name: "Super Admin",
//           slug: "super-admin",
//         },
//         T_RESOURCE: {
//           name: "Read Users",
//           parentName: "Users",
//           slug: "read-all-users",
//         },
//       },
//       {
//         isAccess: true,
//         isActive: true,
//         roleId: 1,
//         resourceId: 5,
//         T_ROLE: {
//           name: "Super Admin",
//           slug: "super-admin",
//         },
//         T_RESOURCE: {
//           name: "Delete User",
//           parentName: "Users",
//           slug: "delete-user",
//         },
//       },
//       {
//         isAccess: true,
//         isActive: true,
//         roleId: 1,
//         resourceId: 1,
//         T_ROLE: {
//           name: "Super Admin",
//           slug: "super-admin",
//         },
//         T_RESOURCE: {
//           name: "Add User",
//           parentName: "Users",
//           slug: "create-user",
//         },
//       },
//       {
//         isAccess: false,
//         isActive: true,
//         roleId: 1,
//         resourceId: 3,
//         T_ROLE: {
//           name: "Super Admin",
//           slug: "super-admin",
//         },
//         T_RESOURCE: {
//           name: "Read User",
//           parentName: "Users",
//           slug: "read-user",
//         },
//       },
//     ],
//   },
// }

export default function mockAuth(mock) {
  mock.onPost(LOGIN_URL).reply(({ data }) => {
    const { email, password } = JSON.parse(data)
    console.log("email : password from login form", email, password)
    if (email && password) {
      const getUserdata = [userTableMock[0].data.user]
      console.log("user boleen", getUserdata)

      const user = getUserdata.find(
        (x) => x.email.toLocaleLowerCase() === email.toLocaleLowerCase()
      )
      console.log("user res", user)
      // getUserdata.email.toLocaleLowerCase() === email.toLocaleLowerCase() &&
      // getUserdata.password === password

      // const user = userTableMock.find(
      //   (x) =>
      //     x.email.toLowerCase() === email.toLowerCase() &&
      //     x.password === password
      // )

      if (user) {
        console.log("user data", { ...user })
        return [200, { ...user, password: undefined }]
      }
    }

    return [400]
  })

  mock.onPost(REGISTER_URL).reply(({ data }) => {
    const { email, fullname, username, password } = JSON.parse(data)

    if (email && fullname && username && password) {
      const user = {
        id: generateUserId(),
        email,
        fullname,
        username,
        password,
        firstname: fullname,
        lastname: "Stark",
        roles: [2], // Manager
        authToken: "auth-token-" + Math.random(),
        refreshToken: "auth-token-" + Math.random(),
        pic: process.env.PUBLIC_URL + "/media/users/default.jpg",
      }

      userTableMock.push(user)

      return [200, { ...user, password: undefined }]
    }

    return [400]
  })

  mock.onPost(REQUEST_PASSWORD_URL).reply(({ data }) => {
    const { email } = JSON.parse(data)

    if (email) {
      const user = userTableMock.find(
        (x) => x.email.toLowerCase() === email.toLowerCase()
      )

      if (user) {
        user.password = undefined

        return [200, { ...user, password: undefined }]
      }
    }

    return [400]
  })

  // mock.onGet(ME_URL).reply(({ headers: { Authorization } }) => {
  //   // const getUserToken = userTableMock[0].data.tokens
  //   console.log("ME-Params: ", { Authorization })
  //   const authToken = Authorization
  //   // &&
  //   // Authorization.startsWith("Bearer ") &&
  //   // Authorization.slice("Bearer ".length)

  //   if (authToken) {
  //     const userData = [userTableMock[0].data.user]
  //     const user = userData.find((x) => x.authToken === authToken)

  //     //const user = getUserToken.access === authToken

  //     if (user) {
  //       return [200, { ...user, password: undefined }]
  //     }
  //   }

  //   return [401]
  // })

  function generateUserId() {
    const ids = userTableMock.map((el) => el.id)
    const maxId = Math.max(...ids)
    return maxId + 1
  }
}
