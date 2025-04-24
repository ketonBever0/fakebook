import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './ui/Navbar';
import Users from './pages/Users';
import Home from './pages/Home';
import Interests from './pages/Interests';
import Messages from './pages/Messages';
import Posts from './pages/Posts';
import Comments from './pages/Comments';
import Friends from './pages/Friends';
import Groups from './pages/Groups';
import GroupMessages from './pages/GroupMessages';
import UserGroups from './pages/UserGroups';
import UserInterests from './pages/UserInterests';
import ForbiddenExpressions from './pages/ForbiddenExpressions';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
      <div id='main'>
        <Router>
          <Navbar />
          <Routes>
            <Route path='*' element={<Home />} />
            <Route path='/' element={<Home />} />
            <Route path='/LoginPage' element={<LoginPage onRegisterClick={function (): void {
              throw new Error('Function not implemented.');
            } } />} />
            <Route path='/RegisterPage' element={<RegisterPage onLoginClick={function (): void {
              throw new Error('Function not implemented.');
            } } />} />
            <Route path='/users' element={<Users />} />
            <Route path='/interests' element={<Interests />} />
            <Route path='/messages' element={<Messages />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/comments" element={<Comments />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/group-messages" element={<GroupMessages />} />
            <Route path="/user-groups" element={<UserGroups />} />
            <Route path="/user-interests" element={<UserInterests />} />
            <Route path="/forbidden-expressions" element={<ForbiddenExpressions />} /> {/* Add ForbiddenExpressions route */}
          </Routes>
        </Router>
      </div>
  );
}

export default App; // Ensure this line exists