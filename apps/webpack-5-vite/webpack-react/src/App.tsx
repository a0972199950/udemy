import { createElement, type FC, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import "@/assets/styles/global";

const App: FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route index element={createElement(lazy(() => import("@/pages")))} />

          <Route path="users">
            <Route
              index
              element={createElement(lazy(() => import("@/pages/users/")))}
            />
            <Route
              path=":id"
              element={createElement(lazy(() => import("@/pages/users/[id]")))}
            />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
