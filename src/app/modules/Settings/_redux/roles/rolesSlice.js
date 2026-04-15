import { createSlice } from "@reduxjs/toolkit";

const initialRolesState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: null,
  roleForEdit: undefined,
  lastError: null,
  accessRights: null,
};

export const callTypes = {
  list: "list",
  action: "action",
};

export const rolesSlice = createSlice({
  name: "roles",
  initialState: initialRolesState,
  reducers: {
    catchError: (state, action) => {
      state.error = `${action.type}: ${action.payload.error}`;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = false;
      } else {
        state.actionsLoading = false;
      }
    },
    startCall: (state, action) => {
      state.error = null;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = true;
      } else {
        state.actionsLoading = true;
      }
    },
    rolesFetched: (state, action) => {
      //console.log("action.payload", action.payload)
      const { totalResults, rows } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.entities = rows;
      state.totalCount = totalResults;
    },
    accessRightsUpdated: (state, action) => {
      state.actionsLoading = false;

      if (!action.payload?.length) {
        return;
      }

      // Create a map of updates by resourceId (store only the isAccess value)
      const updatesMap = new Map(
        action.payload.map((item) => [item?.resourceId, item.isAccess]),
      );

      // Iterate through each module
      Object.keys(state.accessRights).forEach((moduleName) => {
        const moduleResources = state.accessRights[moduleName];

        if (Array.isArray(moduleResources)) {
          // Update only the isAccess property of each resource
          const updatedResources = moduleResources.map((resource) => {
            const newIsAccess = updatesMap.get(resource.resourceId);

            if (newIsAccess !== undefined) {
              // Only update isAccess, keep everything else the same
              return {
                ...resource,
                isAccess: newIsAccess,
              };
            }

            return resource; // No update for this resource
          });

          state.accessRights[moduleName] = updatedResources;
        }
      });
    },
    roleFetched: (state, action) => {
      //console.log("action.payload.roleForEdit", action.payload)
      state.actionsLoading = false;
      state.roleForEdit = action.payload.roleForEdit;
      state.error = null;
    },
    roleDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => el.id !== action.payload.id,
      );
    },
    roleCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.entities.push(action.payload.role);
    },
    roleUpdated: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.map((entity) => {
        if (entity.id === action.payload.updatedRole.id) {
          return action.payload.updatedRole;
        }

        return entity;
      });
    },
    accessRightsFetched: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.listLoading = false;
      state.accessRights = action.payload;
    },

    updateAccessRightByRoleAndResourceId: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.map((entity) => {
        if (entity.id === action.payload.updatedRole.id) {
          return action.payload.updatedRole;
        }

        return entity;
      });
    },
  },
});
