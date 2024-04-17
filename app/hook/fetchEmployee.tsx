" ";

import { onSnapshot, collection } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";

let files = collection(db, "files");


