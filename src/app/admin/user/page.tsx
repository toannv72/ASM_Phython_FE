"use client";

import { DataTable } from "./data-table";
import { columns, User } from "./columns";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/configs/firebase";

// Define the function to fetch static data
// async function getStaticData(): Promise<User[]> {
//   return [
//     {
//       id: "1111111111",
//       amount: 100,
//       status: "pending",
//       email: "m@example.com",
//     },
//     {
//       id: "22222222",
//       amount: 10220,
//       status: "pending",
//       email: "m@example.com",
//     },
//   ];
// }

export default function Page() {
  const [data, setData] = useState<User[]>([]);
  // const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      // Fetch data from Firestore
      const querySnapshot = await getDocs(collection(db, "user"));
      const items: User[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];
      setData(items); 
      console.log('====================================');
      console.log(items); 
      console.log('====================================');
    } catch (error) {
      console.error("Error fetching Firestore data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
 

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
