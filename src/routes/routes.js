import React, { lazy } from "react";
import {
  Route,
  Switch
} from "react-router-dom";

import DefaultRoute from "@/components/layout/DefaultRoute";
import AdminRoute from "@/components/layout/AdminRoute";

function Routes() {
  return (
    <Switch>
      {/* user */}
      <Route exact path="/login" component={lazy(() => import('@/pages/Login'))} />
      <Route exact path="/reset" component={lazy(() => import('@/pages/Reset'))} />
      <Route exact path="/register_success" component={lazy(() => import('@/pages/RegisterSuccess'))} />
      <Route exact path="/register_fail" component={lazy(() => import('@/pages/RegisterFail'))} />
      <Route exact path="/invitedsignup" component={lazy(() => import('@/pages/InvitedSignUp'))} />

      <DefaultRoute exact path="/" component={lazy(() => import('@/pages/Files'))} />
      <DefaultRoute exact path="/file" component={lazy(() => import('@/pages/Files'))} />
      <DefaultRoute exact path="/file/:id" component={lazy(() => import('@/pages/Files'))} />
      <DefaultRoute exact path="/shared" component={lazy(() => import('@/pages/Files'))} />
      <DefaultRoute exact path="/shared/:id" component={lazy(() => import('@/pages/Files'))} />
      <DefaultRoute exact path={["/meta", "/meta/:id"]} component={lazy(() => import('@/pages/Meta'))} />
      <DefaultRoute exact path={["/meta_classifier", "/meta_classifier/:id"]} component={lazy(() => import('@/pages/MetaClassifier'))} />
      <DefaultRoute exact path={["/classifier"]} component={lazy(() => import('@/pages/Classifier'))} />
      <DefaultRoute exact path={["/workspaces"]} component={lazy(() => import('@/pages/Workspaces'))} />
      <DefaultRoute exact path={["/test"]} component={lazy(() => import('@/pages/Test'))} />

      {/* admin */}
      <AdminRoute
        exact
        path={["/admin/", "/admin/accounts"]}
        component={lazy(() => import('@/pages/admin/Accounts'))}
      />
      <AdminRoute exact path={["/admin/roles"]} component={lazy(() => import('@/pages/admin/Roles'))} />
      <AdminRoute exact path={["/admin/features"]} component={lazy(() => import('@/pages/admin/Features'))} />
      <AdminRoute exact path={["/admin/permission"]} component={lazy(() => import('@/pages/admin/Permission'))} />
      <AdminRoute
        exact
        path={["/admin/classifier", "/admin/classifier/:folder"]}
        component={lazy(() => import('@/pages/admin/ClassifierManage'))}
      />
      <AdminRoute
        exact
        path={["/admin/workspaces"]}
        component={lazy(() => import('@/pages/admin/WorkspacesManage'))}
      />

      <AdminRoute exact path={["/admin/upgrade"]} component={lazy(() => import('@/pages/admin/Upgrade'))} />
      <AdminRoute exact path={["/admin/license"]} component={lazy(() => import('@/pages/admin/License'))} />
      <AdminRoute exact path={["/admin/service"]} component={lazy(() => import('@/pages/admin/Service'))} />
      <AdminRoute exact path={["/admin/debuglogs"]} component={lazy(() => import('@/pages/admin/DebugLogs'))} />
      <AdminRoute exact path={["/admin/support"]} component={lazy(() => import('@/pages/admin/Support'))} />
      <AdminRoute exact path={["/admin/logs", "/admin/logs/:userid"]} component={lazy(() => import('@/pages/admin/Logs'))} />
      {/* not found */}
      <Route exact component={lazy(() => import('@/pages/NotFound'))} />
    </Switch>
  );
}

export default Routes;
