" ";

import { Inter } from "next/font/google";
import { Kanit } from "next/font/google";
import "./globals.css";
import Headers from "./components/Headers";
import { NavBar } from "./components/NavBar";
import Footer from "./components/Footer";
import { useState } from "react";
import { useRouter } from "next/navigation";
import signIn from "./signin";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";

const latin = Kanit({
  weight: ["400", "700"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});




export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {

  const [role, setRole] = useState("");
  const router = useRouter();
  const auth = getAuth();
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const uid = user.uid;
      const email = user.email;
      // console.log("This account:", uid, email);

      const q = query(collection(db, "Employees"), where("employee_email", "==", email));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
         
        console.log(doc.id, " => ", doc.data().role);
        // setUserName(doc.id);
        setRole(doc.data().role);
      });
    } else {
      // User is signed out
      // alert("sign in Error!");
      router.push("/")
      setRole("")

    }
  });



  return (
    <html lang="en">
      <head>
        <title>PKM HINO</title>
      </head>
      {
        role == "" ?
          <body className={latin.className}>


            <div className="flex-row flex">

              {children}

            </div>


          </body>

          :
          <body className={latin.className}>
            <Headers></Headers>

            <div className="flex-row flex">
              <NavBar />

              {children}

            </div>

            <Footer />
          </body>
      }

    </html>
  );
}
