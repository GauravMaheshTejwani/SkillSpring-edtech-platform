import React , {useEffect, useState} from "react";
import { Link, matchPath, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/Logo/Logo Full Light.png";
import { NavbarLinks } from "../../data/navbar-links";
import { useSelector } from "react-redux";
import { AiOutlineShoppingCart } from "react-icons/ai";
import ProfileDropDown from "../core/Auth/ProfileDropDown";
import { IoIosArrowDown } from "react-icons/io";
import { apiConnector } from "../../services/apiconnector";
import { categories } from "../../services/api";
import { HiSearch } from "react-icons/hi";

const Navbar = () => {

  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart)
  const [subLinks, setSubLinks] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const fetchSubLinks = async () => {
    try {
      const result = await apiConnector("GET", categories.CATEGORIES_API);
      setSubLinks(result.data.allCategories);
    } catch (error) {
      console.log("Could not fetch the category list", error);
    }
  };

  useEffect(() => {
    fetchSubLinks();
  }, []);

  const location = useLocation();

  const matchRoute = (route, location) => {
    return matchPath({ path: route }, location.pathname);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if(searchValue?.length > 0){
      navigate(`/search/${searchValue}`);
      setSearchValue("");
    }
  }

  return (
    <div className=" flex h-14 items-center border-b-[1px] border-b-gray-700 w-screen relative z-50">
      <div className=" flex w-full max-w-7xl mx-auto px-4 items-center justify-between">
        <Link to="/">
          <img
            src={logo}
            alt="logo"
            width={160}
            height={42}
            loading="lazy"
          ></img>
        </Link>

        {/* Nav Links */}
        <nav>
          <ul className="flex gap-x-6 text-gray-50">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <div className=" relative flex items-center gap-2 group">
                    <p>{link.title}</p>
                    <IoIosArrowDown></IoIosArrowDown>

                    <div className=" invisible absolute left-[50%] 
                            translate-x-[-50%] translate-y-[40%]
                            top-[50%] flex flex-col rounded-md
                            bg-gray-50 p-4 text-gray-900 
                            opacity-0 transition-all duration-200 
                            group-hover:visible group-hover:opacity-100 lg:w-[300px] z-50">
                      <div className=" absolute left-[50%] top-0 
                            translate-x-[80%] translate-y-[-45%]
                            h-6 w-6 rotate-45 rounded bg-gray-50">

                      </div>

                      {
                        subLinks.length > 0 ? 
                          (
                            subLinks.map( (subLink, index) => (
                              <Link to={`/catalog/${subLink.name
                                    .split(" ")
                                    .join("-")
                                    .toLowerCase()}`}
                                     key={index}>
                                <p>{subLink.name}</p>
                              </Link>
                            ))
                          ) 
                        : (<div></div>)
                      }

                    </div>
                  </div>
                ) : (
                  <Link to={link?.path}>
                    <p
                      className={`${
                        matchRoute(link?.path, location)
                          ? "text-yellow-200"
                          : "text-gray-50"
                      }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}

            {user && <form
              onSubmit={handleSearch}
              className="flex items-center relative"
            >
              <input
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                }}
                id="searchinput"
                type="text"
                placeholder="Search"
                className=" absolute top-0 left-0 border-0 
                focus:ring-1 ring-gray-600 rounded-full px-2 py-1 
                text-[15px] w-28 text-gray-300 focus:outline-none 
                focus:border-transparent bg-gray-800"
              />

              <HiSearch
                type="submit"
                id="searchicon"
                size={20}
                className=" text-gray-400 top-1 absolute cursor-pointer left-20"
              />
            </form>}

          </ul>
        </nav>

        {/* Login SignUp */}
        <div className="flex gap-5 md:flex items-center">
          {user && user?.accoutType != "Instructor" && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className=" fill-gray-200 w-7 h-7" />
              {totalItems > 0 && <span
              className=" shadow-sm shadow-black text-[10px] font-bold bg-yellow-400 text-gray-900 rounded-full px-1 absolute -top-[2px] right-[8px]"
              >{totalItems}</span>}
            </Link>
          )}
          {token === null && (
            <Link to="/login">
              <button className="border border-gray-700 bg-gray-800 px-[12px] py-[8px] text-gray-200 rounded-md cursor-pointer">
                Log in
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button className="border border-gray-700 bg-gray-800 px-[12px] py-[8px] text-gray-200 rounded-md cursor-pointer">
                Sign Up
              </button>
            </Link>
          )}
          {token !== null && (
            <div className=" pt-2">
              <ProfileDropDown />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
