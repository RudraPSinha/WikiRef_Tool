import {
    createBrowserRouter,
    
  } from "react-router-dom";
import Index from "./pages/Index";




const router = createBrowserRouter([{
    path: "/",
    element: <div>Hello</div>

},
{
    path: "/index",
    element: <Index/>
}
])


export default router