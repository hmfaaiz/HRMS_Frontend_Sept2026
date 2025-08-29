import React, { Suspense } from "react"
import { Redirect, Switch } from "react-router-dom"
import { shallowEqual, useSelector } from "react-redux"
import { ContentRoute, LayoutSplashScreen } from "../../../../_metronic/layout"
import { RolePage } from "./role/RolesPage"
import { RolesAccess } from "./role/role-access-rights/RolesAccess"

export default function SettingsPage() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/settings"
            to="/settings/read-all-roles"
          />
        }
        <ContentRoute path="/settings/read-all-roles" component={RolePage} />
        <ContentRoute
          path="/settings/read-all-roles-access/:id/edit"
          component={RolesAccess}
        />
        {/* <ContentRoute path="/e-commerce/products/new" component={ProductEdit} />
      <ContentRoute
        path="/e-commerce/products/:id/edit"
        component={ProductEdit}
      />

      <ContentRoute path="/e-commerce/products" component={ProductsPage} /> */}
      </Switch>
    </Suspense>
  )
}
