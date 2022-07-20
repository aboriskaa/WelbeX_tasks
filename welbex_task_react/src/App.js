import 'materialize-css/dist/css/materialize.min.css'
import './App.css';
import TablePage from './pages/TablePage/TablePage';
import Navbar from './components/Navbar/Navbar';

function App() {
  return (
    <div className="container">
      <Navbar />
      <TablePage />
    </div>
  );
}

export default App;
