// import React from "react";
// import { useDispatch } from "react-redux";
// import { Route, useRouteMatch } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { DesignationUIProvider } from "./DesignationUIContext";
// import { DesignationEditDialog } from "./designation-edit-dialog/DesignationEditDialog";

// import { BankDeleteDialog } from "./bank-delete-dialog/BankDeleteDialog";
// import { DesignationActiveDialog } from "./bank-active-dialog/BankActiveDialog";
// import { ReligionCard } from "./religion-card/ReligionCard";

// import { useSelector, shallowEqual } from "react-redux"

// export function ProfilePage({ history }) {
//   const dispatch = useDispatch();
//   const readMatch = useRouteMatch("/profile/read-all-profile/:id/read");
//   const DesignationUIEvents = {

 



//     newDesignationButtonClick: () => {
  
//       history.push("/profile/read-all-profile/new");
//     },
//     openEditDesignationDialog: (id) => {

//       history.push(`/profile/read-all-profile/${id}/edit`);
//     },
//     openDeleteDesignationDialog: (id, status) => {
//       history.push(`/profile/read-all-profile/${id}/${status}/delete`);
//     },
//     openActiveDesignationDialog: (id) => {
//       history.push(`/profile/read-all-profile/${id}/active`);
//     },
//     openReadDesignationDialog: (id, isUserRead) => {

  
//       history.push(`/profile/read-all-profile/${id}/read`);
//     },
//   };
//   const { userAccess } = useSelector(
//     (state) => ({
//       userAccess: state.auth.userAccess.Profile
//     }),
//     shallowEqual
//   )

//   const isAccessForEdit = userAccess?.find(
//     (item) => item.componentName === "UpdateProfile"
//   );

//   const isAccessForDelete = userAccess?.find(
//     (item) => item.componentName === "DeleteProfile"
//   );

//   const accessUser = userAccess.find(
//     (item) => item.componentName === "CreateProfile"
//   )
//   const isAccessForRead = userAccess?.find(
//     (item) => item.componentName === "ReadProfile"
//   );
//   return (

//     <DesignationUIProvider DesignationUIEvents={DesignationUIEvents}>
//       <Route
//   path="/profile/read-all-profile"
//   render={({ history }) => (
//     <ReligionCard onHide={() => history.push("/profile/read-all-profile")} />
//   )}
// />
      

//       {/* <ReligionCard onHide={() => history.push("/profile/read-all-profile")} /> */}


//       {accessUser && (
//         <Route path="/profile/read-all-profile/new" render={({ match, history }) => (
//           <DesignationEditDialog
//             status="new"
//             onHide={() => history.push("/profile/read-all-profile")}
//           />
//         )} />

//       )}
//       {isAccessForEdit && (
//         <Route path="/profile/read-all-profile/:id/edit" render={({ match, history }) => (
//           <DesignationEditDialog
//             id={match.params.id}
//             status="edit"
//             onHide={() => history.push("/profile/read-all-profile")}
//           />
//         )} />
//       )}
//       {/* {isAccessForRead && (
//         <Route path="/profile/read-all-profile/:id/read" render={({ match, history }) => (
//           <DesignationEditDialog
//             id={match.params.id}
//             status="read"
//             userForRead={true}
//             onHide={() => history.push("/profile/read-all-profile")}
//           />
//         )} />
//       )} */}


//       {readMatch && isAccessForRead && (
//   <DesignationEditDialog
//     show={true}
//     id={readMatch.params.id}
//     status="read"
//     userForRead={true}
//     onHide={() => history.push("/profile/read-all-profile")}
//   />
// )}

//       {isAccessForDelete && (
//         <Route path="/profile/read-all-profile/:id/:status/delete">
//           {({ history, match }) => (
//             <BankDeleteDialog
//               show={match != null}
//               id={match && match.params.id}
//               status={match && match.params.status}
//               onHide={() => {
//                 history.push("/profile/read-all-profile");
//               }}
//             />
//           )}
//         </Route>
//       )}
//       <Route path="/profile/read-all-profile/:id/active">
//         {({ history, match }) => (
//           <DesignationActiveDialog
//             show={match != null}
//             id={match && match.params.id}
//             status={match && match.params.status}
//             onHide={() => {
//               history.push("/profile/read-all-profile");
//             }}
//           />
//         )}
//       </Route>




//       <ToastContainer
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />
//     </DesignationUIProvider>
//   );
// }
import React from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useRouteMatch, useHistory } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DesignationUIProvider } from "./DesignationUIContext";
import { DesignationEditDialog } from "./designation-edit-dialog/DesignationEditDialog";
import { BankDeleteDialog } from "./bank-delete-dialog/BankDeleteDialog";
import { DesignationActiveDialog } from "./bank-active-dialog/BankActiveDialog";
import { ReligionCard } from "./religion-card/ReligionCard";

export function ProfilePage() {
  const dispatch = useDispatch();
  const history = useHistory();

  // Route matches
  const readMatch = useRouteMatch("/profile/read-all-profile/:id/read");
  const editMatch = useRouteMatch("/profile/read-all-profile/:id/edit");
  const newMatch = useRouteMatch("/profile/read-all-profile/new");
  const deleteMatch = useRouteMatch("/profile/read-all-profile/:id/:status/delete");
  const activeMatch = useRouteMatch("/profile/read-all-profile/:id/active");

  // UI Events
  const DesignationUIEvents = {
    newDesignationButtonClick: () => history.push("/profile/read-all-profile/new"),
    openEditDesignationDialog: (id) => history.push(`/profile/read-all-profile/${id}/edit`),
    openReadDesignationDialog: (id) => history.push(`/profile/read-all-profile/${id}/read`),
    openDeleteDesignationDialog: (id, status) =>
      history.push(`/profile/read-all-profile/${id}/${status}/delete`),
    openActiveDesignationDialog: (id) => history.push(`/profile/read-all-profile/${id}/active`),
  };

  // Access Control
  const { userAccess } = useSelector(
    (state) => ({
      userAccess: state.auth.userAccess.Profile,
    }),
    shallowEqual
  );

  const isAccessForRead = userAccess?.find((item) => item.componentName === "ReadProfile");
  const isAccessForEdit = userAccess?.find((item) => item.componentName === "UpdateProfile");
  const isAccessForDelete = userAccess?.find((item) => item.componentName === "DeleteProfile");
  const accessUser = userAccess?.find((item) => item.componentName === "CreateProfile");

  return (
    <DesignationUIProvider DesignationUIEvents={DesignationUIEvents}>
      {/* Main Card (always visible) */}
      <ReligionCard onHide={() => history.push("/profile/read-all-profile")} />

      {/* New */}
      {newMatch && accessUser && (
        <DesignationEditDialog
          show={true}
          status="new"
          onHide={() => history.push("/profile/read-all-profile")}
        />
      )}

      {/* Edit */}
      {editMatch && isAccessForEdit && (
        <DesignationEditDialog
          show={true}
          id={editMatch.params.id}
          status="edit"
          onHide={() => history.push("/profile/read-all-profile")}
        />
      )}

      {/* Read */}
      {readMatch && isAccessForRead && (
        <DesignationEditDialog
          show={true}
          id={readMatch.params.id}
          status="read"
          userForRead={true}
          onHide={() => history.push("/profile/read-all-profile")}
        />
      )}

      {/* Delete */}
      {deleteMatch && isAccessForDelete && (
        <BankDeleteDialog
          show={true}
          id={deleteMatch.params.id}
          status={deleteMatch.params.status}
          onHide={() => history.push("/profile/read-all-profile")}
        />
      )}

      {/* Active */}
      {activeMatch && (
        <DesignationActiveDialog
          show={true}
          id={activeMatch.params.id}
          onHide={() => history.push("/profile/read-all-profile")}
        />
      )}

      {/* Toast */}
      <ToastContainer position="top-right" autoClose={5000} />
    </DesignationUIProvider>
  );
}
