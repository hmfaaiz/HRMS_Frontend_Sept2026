import React from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DesignationUIProvider } from "./DesignationUIContext";
import { DesignationEditDialog } from "./designation-edit-dialog/DesignationEditDialog";

import { BankDeleteDialog } from "./bank-delete-dialog/BankDeleteDialog";
import { DesignationActiveDialog } from "./bank-active-dialog/BankActiveDialog";
import { ReligionCard } from "./religion-card/ReligionCard";

import { useSelector, shallowEqual } from "react-redux"

export function ProfilePage({ history }) {
  const dispatch = useDispatch();
  const DesignationUIEvents = {

    newAcademicButtonClick: () => {
    
      history.push("/academic/read-all-academic/new");
    },

    newContactButtonClick: () => {
    
      history.push("/contact/read-all-contact/new");
    },

    newWorkExperienceButtonClick: () => {
    
      history.push("/experience/read-all-experience/new");
    },

    newSkillButtonClick: () => {
    
      history.push("/skills/read-all-skills/new");
    },

    newIncidentButtonClick: () => {
    
      history.push("/incident/read-all-incident/new");
    },

    newDesignationButtonClick: () => {
      // dispatch(fetchAllCountry());
      // dispatch(fetchRoles());
      // dispatch(fetchCenters());
      // dispatch(fetchUserStatusTypes({ filter: { normal: true } }));
      history.push("/profile/read-all-profile/new");
    },
    openEditDesignationDialog: (id) => {
      // dispatch(fetchAllCountry());
      // dispatch(fetchRoles());
      // dispatch(fetchCenters());
      // dispatch(fetchUserStatusTypes({ filter: { normal: true } }));
      history.push(`/profile/read-all-profile/${id}/edit`);
    },
    openDeleteDesignationDialog: (id, status) => {
      history.push(`/profile/read-all-profile/${id}/${status}/delete`);
    },
    openActiveDesignationDialog: (id) => {
      history.push(`/profile/read-all-profile/${id}/active`);
    },
    openReadDesignationDialog: (id, isUserRead) => {
      
      // dispatch(fetchAllCountry());
      // dispatch(fetchRoles());
      // dispatch(fetchCenters());
      // dispatch(fetchUserStatusTypes({ filter: { normal: true } }));
      history.push(`/profile/read-all-profile/${id}/read`);
    },
  };
  const { userAccess } = useSelector(
    (state) => ({
      userAccess: state.auth.userAccess.Profile
    }),
    shallowEqual
  )

    const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdateProfile"
  );

  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteProfile"
  );

   const accessUser = userAccess.find(
    (item) => item.componentName === "CreateProfile"
  )
    const isAccessForRead= userAccess?.find(
    (item) => item.componentName === "ReadProfile"
  );
  return (
    
    <DesignationUIProvider DesignationUIEvents={DesignationUIEvents}>
      <Route
  path="/profile/read-all-profile"
  render={({ history }) => (
    <ReligionCard onHide={() => history.push("/profile/read-all-profile")} />
  )}
/>
      

         {/* <ReligionCard /> */}
         
       {/* <Route exact path="/contact/read-all-contact/new">
        {({ history, match }) => (
          <AcademicEditDialog
            show={match != null}
            onHide={() => {
              history.push("/contact/read-all-contact");
            }}
          />
        )}
      </Route>
      <Route exact path="/contact/read-all-contact/new">
        {({ history, match }) => (
          <ContactEditDialog
            show={match != null}
            onHide={() => {
              history.push("/contact/read-all-contact/new");
            }}
          />
        )}
      </Route> */}



      {/* <Route exact path="/profile/read-all-profile/new">
        {({ history, match }) => (
          <DesignationEditDialog
            show={match != null}
            onHide={() => {
              history.push("/profile/read-all-profile");
            }}
          />
        )}
      </Route> */}
      {/* <Route path="/profile/read-all-profile/:id/edit">
        {({ history, match }) => (
          <DesignationEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/profile/read-all-profile");
            }}
          />
        )}
      </Route> */}
      {/* <Route path="/profile/read-all-profile/:id/read">
        {({ history, match }) => (
          <DesignationEditDialog
            show={match != null}
            id={match && match.params.id}
            userForRead={true}
            onHide={() => {
              history.push("/profile/read-all-profile");
            }}
          />
        )}
      </Route> */}


      {/* <Route exact path="/profile/read-all-profile/new" component={DesignationEditDialog} />
       */}
             {/* <Route exact path="/profile/read-all-profile/new">
        {({ history, match }) => (
          <DesignationEditDialog
            show={match != null}
            onHide={() => {
              history.push("/profile/read-all-profile");
            }}
          />
        )}
      </Route> */}
      {accessUser && (
         <Route path="/profile/read-all-profile/new" render={({ match, history }) => (
              <DesignationEditDialog
            status="new"
             onHide={() => history.push("/profile/read-all-profile")}
            />
             )} />

            )}
             {isAccessForEdit && (
                 <Route path="/profile/read-all-profile/:id/edit" render={({ match, history }) => (
              <DesignationEditDialog
             id={match.params.id}
             status="edit"
             onHide={() => history.push("/profile/read-all-profile")}
            />
             )} />
            )}
            {isAccessForRead && (
          <Route path="/profile/read-all-profile/:id/read" render={({ match, history }) => (
           <DesignationEditDialog
        id={match.params.id}
        status="read"
            userForRead={true}
             onHide={() => history.push("/profile/read-all-profile")}
              />
)}         />
)}
{isAccessForDelete && (
      <Route path="/profile/read-all-profile/:id/:status/delete">
        {({ history, match }) => (
          <BankDeleteDialog
            show={match != null}
            id={match && match.params.id}
            status={match && match.params.status}
            onHide={() => {
              history.push("/profile/read-all-profile");
            }}
          />
        )}
      </Route>
      )}
      <Route path="/profile/read-all-profile/:id/active">
        {({ history, match }) => (
          <DesignationActiveDialog
            show={match != null}
            id={match && match.params.id}
            status={match && match.params.status}
            onHide={() => {
              history.push("/profile/read-all-profile");
            }}
          />
        )}
      </Route>



   
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </DesignationUIProvider>
  );
}
