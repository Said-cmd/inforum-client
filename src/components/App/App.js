import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from 'react';
import Blogs from '../Blogs/Blogs';
import Blog from '../Blogs/Blog';
import Login from '../Login/Login';
import AddBlog from '../Blogs/AddBlog'; 
import SignUp from '../SignUp/SignUp'
import Landing from '../Landing/Landing';
import EditBlog from '../Blogs/EditBlog';
import { IoNewspaperSharp } from "react-icons/io5";
import { IoReorderThreeOutline } from "react-icons/io5";
import { IoCloseOutline } from "react-icons/io5";
import NotAuthorized from "../NotAuthorized/NotAuthorized";

function App() {
  const [blogs, setBlogs] = useState([]) 
  const [search, setSearch] = useState('')
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]) 
  const [toggle, setToggle] = useState(false);
  const navigate = useNavigate()
  const navRef = useRef();

  function showNavBar() {
    navRef.current.classList.toggle(".nav-item")
  }

  useEffect(()=>{
    fetch("https://inforum-blog-api.herokuapp.com/blogs")
    .then(res => res.json())
    .then(data => setBlogs(data))
  }, [])

  useEffect(() => {
    fetch("https://inforum-blog-api.herokuapp.com/me").then((r) => {
      if (r.ok) {
        r.json().then((user) => setUser(user));
      }
    }); 
  }, []);

  useEffect(()=>{
    fetch("https://inforum-blog-api.herokuapp.com/comments")
    .then(res => res.json())
    .then(data => setComments(data))
  },[])

  function handleLogoutClick() {
    fetch("https://inforum-blog-api.herokuapp.com/logout", { method: "DELETE" }).then((r) => {
      if (r.ok) {
        setUser(null);
        navigate("/")
      }
    });
  }

  function handleToggleNav() {
    setToggle(!toggle)
    showNavBar()
  }

  function closeToggle() {
    setToggle(false)
  }

  return (
    <>
    <div>
      <nav>
      <div className="spacer-left"></div>
        <Link to="/" style={{ textDecoration: 'none', color: "green" }}>
          <div className="brand">
              <IoNewspaperSharp onClick={closeToggle} color="green" size="4rem" />
              <h1 className="brand-header" onClick={closeToggle}>Inforum</h1>
              </div>
              </Link>
              <div className="toggle">
               {toggle ? <IoCloseOutline onClick={handleToggleNav} color="green" size="4rem" /> : <IoReorderThreeOutline onClick={handleToggleNav} color="green" size="4rem"/>}
              </div>
              <div className="spacer"></div>
        {user ? (
        <>
          <div className="blogs">
          <Link onClick={handleToggleNav} className={toggle ? "nav-item" : "nav-item-responsive"} to="/blogs" style={{ textDecoration: 'none', color: "green" }}>Blogs</Link>
          </div>
          <div className="write">
          <Link onClick={handleToggleNav} className={toggle ? "nav-item" : "nav-item-responsive"}  to="/new-idea" style={{ textDecoration: 'none', color: "green" }}>Write</Link>
          </div>
          <Link className={toggle ? "nav-item" : "nav-item-responsive"}  to="/" onClick={handleLogoutClick} style={{ textDecoration: 'none', color: "green" }}><input onClick={handleToggleNav} className="get-started" type="button" value="Logout"/></Link>
          <div className="spacer-right"></div>
        </>
        )
        :
        (
          <>
            <div className="sign-in"><Link onClick={handleToggleNav} className={toggle ? "nav-item" : "nav-item-responsive"}  to="/login" style={{ textDecoration: 'none', color: "green" }}>Sign in</Link></div>
            <Link className={toggle ? "nav-item" : "nav-item-responsive"}  to="/signup" style={{ textDecoration: 'none', color: "green" }}><input onClick={handleToggleNav} className="get-started" type="button" value="Get started"/></Link>
            <div className="spacer-right"></div>
          </>
        )
        }
      </nav>
    <div className='main'>
      <Routes>
        <Route exact path='/' element={<Landing user={user}/>}/>
        <Route exact path='/login' element={<Login onLogin={setUser}/>}/>
        {user ? (<Route exact path='/blogs' element={<Blogs blogs={blogs} setSearch={setSearch} search={search} user={user}/>}/>) : (<Route exact path="/blogs" element={<NotAuthorized />}/>)}
        {user ? (<Route exact path='/new-idea' element={<AddBlog setBlogs={setBlogs} blogs={blogs}/>}/>) : (<Route exact path="/new-idea" element={<NotAuthorized />}/>)}
        {user ? (<Route exact path='/blogs/:id' element={<Blog blogs={blogs} comments={comments} user={user} setBlogs={setBlogs}/>}/>) : (<Route exact path="/blogs/:id" element={<NotAuthorized />}/>)}
        <Route exact path='/signup' element={<SignUp onLogin={setUser}/>}/>
        {user ? (<Route exact path='/editblog/:id' element={<EditBlog blogs={blogs} setBlogs={setBlogs}/>}/>) : (<Route exact path="/editblog/:id" element={<NotAuthorized />}/>)}
      </Routes>
    </div>
    </div>
    </>
  );
}

export default App;
