import { Route, Switch } from "wouter"
import { HomePage } from "@/pages/home"
import { ProjectDetailPage } from "@/pages/project-detail"
import { NotFoundPage } from "@/pages/not-found"
import { ScrollToTop } from "./ScrollToTop"

export function AppRouter() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/projects/:slug" component={ProjectDetailPage} />
        <Route path="/404" component={NotFoundPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </>
  )
}
