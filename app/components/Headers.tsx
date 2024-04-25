"use client";

import { useState } from "react";
import logo from '../../public/6f6f9279f.png';
import Image from "next/image";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function Headers() {
  const [menuIcon, setIcon] = useState(false);
  const router = useRouter();
  const [role, setRole] = useState("");
  const [username, setUserName] = useState("");
  const [lastname, setLastname] = useState("");

  const handSmallerNav = () => {
    setIcon(!menuIcon);
  };

  console.log(menuIcon);

  const auth = getAuth();
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const uid = user.uid;
      const email = user.email;
      // console.log("This account:", uid, email);

      const q = query(collection(db, "Employees"), where("employee_email", "==", email));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
         
        // console.log(doc.id, " => ", doc.id);
        setUserName(doc.data().employee_fname);
        setLastname(doc.data().employee_lname);
        setRole(doc.data().role);
      });
    } else {
      // User is signed out
      // alert("sign in Error!");
      setRole("")
      return router.push("/")
      

    }
  });

  const handleLogout = () => {
    signOut(auth).then(() => {
      const confirmBox = window.confirm(
        `คุณต้องการออกจากระบบหรือไม่?`
      )

      if (confirmBox == true) {
        alert("ออกจากระบบเสร็จสิ้น")
        try {
          // Sign-out successful.
          console.log("Signed out successfully");
          setRole("")
          return router.push('/')
        } catch (e) {
          console.error("Error adding document: ", e);
        }

      }

    }).catch((error) => {
      // An error happened.
    });
  }

  return (
    <nav className=" bg-black-p dark:bg-gray-800 ">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/dashboard" className="flex items-center space-x-3 rtl:space-x-reverse">
          {/* <img
            src={logo}
            className="h-8"
            alt="Pkmhino Logo"
          />  */}
          <Image src={logo} alt="Pkmhino Logo" className="max-w-10 max-h-10" />


          <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
            PKMHINO
          </span>
        </a>

        {/* S-PC */}
        <div className="hidden w-full md:block md:w-auto" id="navbar-solid-bg">
          <ul className="flex flex-col font-medium mt-4 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent  md:dark:bg-transparent ">
            <li className=" ">
              <p
                className="block py-2 px-3 md:p-0 text-white bg-blue-700 rounded md:bg-transparent hover:border-b-2 border-white hover:scale-110"
                aria-current="page"
              >
                {username} {lastname}
              </p>
            </li>
            <li className="border-solid border-2 border-white px-4 md:bg-transparent hover:scale-110 rounded text-white hover:text-black hover:bg-white">
              <button
                onClick={handleLogout}
                className="block py-2 px-3 md:p-0  rounded  "
              >
                Log out
              </button>
            </li>

          </ul>
        </div>

        <div onClick={handSmallerNav} className="flex md:hidden">
          {!menuIcon ? (
            <button
              data-collapse-toggle="navbar-solid-bg"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 "
              aria-controls="navbar-solid-bg"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          ) : (
            <button
              data-collapse-toggle="navbar-solid-bg"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg hover:bg-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-gray-200 "
              aria-controls="navbar-solid-bg"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="100"
                height="100"
                viewBox="0,0,256,256"
              >
                <g
                  fill="#363636"
                  fillRule="nonzero"
                  stroke="none"
                  strokeWidth="1"
                  strokeLinecap="butt"
                  strokeLinejoin="miter"
                  strokeMiterlimit="10"
                  strokeDasharray=""
                  strokeDashoffset="0"
                  fontFamily="none"
                  fontWeight="none"
                  fontSize="none"
                  textAnchor="none"
                >
                  <g transform="scale(8.53333,8.53333)">
                    <path d="M7,4c-0.25587,0 -0.51203,0.09747 -0.70703,0.29297l-2,2c-0.391,0.391 -0.391,1.02406 0,1.41406l7.29297,7.29297l-7.29297,7.29297c-0.391,0.391 -0.391,1.02406 0,1.41406l2,2c0.391,0.391 1.02406,0.391 1.41406,0l7.29297,-7.29297l7.29297,7.29297c0.39,0.391 1.02406,0.391 1.41406,0l2,-2c0.391,-0.391 0.391,-1.02406 0,-1.41406l-7.29297,-7.29297l7.29297,-7.29297c0.391,-0.39 0.391,-1.02406 0,-1.41406l-2,-2c-0.391,-0.391 -1.02406,-0.391 -1.41406,0l-7.29297,7.29297l-7.29297,-7.29297c-0.1955,-0.1955 -0.45116,-0.29297 -0.70703,-0.29297z"></path>
                  </g>
                </g>
              </svg>
            </button>
          )}
        </div>

        {/* S-Mobile */}
        {menuIcon && (
          <div
            className={
              menuIcon ? "md:hidden w-full" : "md:hidden w-full top-28"
            }
          >
            <div className="md:hidden w-full " id="navbar-solid-bg">
              <ul className="flex flex-col font-medium mt-4 rounded-lg bg-gray-50 rtl:space-x-reverse dark:bg-gray-800  dark:border-gray-700">
                <li>
                  <p
                    className="block py-2 px-3  text-gray-900 rounded hover:bg-gray-200 "
                    aria-current="page"
                  >
                    Thanaporn Yaisomanung
                  </p>
                </li>
                <li>
                  <a
                    href="/dashboard"
                    className="block py-2 px-3  text-gray-900 rounded hover:bg-gray-200 "
                    aria-current="page"
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="/truck"
                    className="block py-2 px-3  text-gray-900 rounded hover:bg-gray-200 "
                    aria-current="page"
                  >
                    ข้อมูลรถ
                  </a>
                </li>
                <li>
                  <a
                    href="/truckprice"
                    className="block py-2 px-3  text-gray-900 rounded hover:bg-gray-200 "
                    aria-current="page"
                  >
                    ตรวจสอบราคารถ
                  </a>
                </li>
                <li>
                  <a
                    href="/customer"
                    className="block py-2 px-3  text-gray-900 rounded hover:bg-gray-200 "
                    aria-current="page"
                  >
                    ข้อมูลลูกค้า
                  </a>
                </li>
                <li>
                  <a
                    href="/database"
                    className="block py-2 px-3  text-gray-900 rounded hover:bg-gray-200 "
                    aria-current="page"
                  >
                    ฐานข้อมูล
                  </a>
                </li>
                <li>
                  <a
                    onClick={handleLogout}
                    className="block py-2 px-3  text-gray-900 rounded hover:bg-gray-200  "
                    aria-current="page"
                  >
                    Log out
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
