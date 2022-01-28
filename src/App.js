import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Management from './Management.jsx'
import Create from './Create.jsx'
import Update from './Update.jsx'
import Form from './Form.jsx'


function App() {
  return (
    <Router basename="/">
      <Switch>
        <Route path='/' exact component={Form} />
        <Route path='/admin/_/management/products' exact component={Management} />
        <Route path='/admin/_/management/products/create' exact component={Create} />
        <Route path='/admin/_/management/products/update/:id' exact component={Update} />
      </Switch>
    </Router>
  )
}

export default App;