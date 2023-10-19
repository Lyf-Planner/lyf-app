// import { useState } from "react";
// import { ListInput } from "./components/List";
// import { FaChevronCircleRight, FaChevronCircleDown } from "react-icons/fa";
// import { useMediaQuery } from "react-responsive";

// export const Upcoming = ({ upcoming, updateUpcoming }: any) => {
//   const startHidden = useMediaQuery({ query: "(max-width: 450px)" });
//   const [hide, updateHide] = useState(startHidden);

//   return (
//     <div className="flex flex-col gap-2">
//       <button
//         className="font-bold text-lg flex flex-row gap-2"
//         onClick={() => updateHide(!hide)}
//       >
//         <p className="hover:underline ml-1">Upcoming Events</p>{" "}
//         {hide ? (
//           <FaChevronCircleRight className="my-auto ml-auto mr-4" />
//         ) : (
//           <FaChevronCircleDown className="my-auto ml-auto mr-4" />
//         )}
//       </button>
//       {!hide && (
//         <div className="flex flex-col gap-2">
//           <ListInput
//             list={upcoming}
//             updateList={updateUpcoming}
//             badgeColor="bg-slate-900"
//             badgeTextColor="text-slate-300"
//             placeholder="Add Event +"
//             isEvents
//           />
//         </div>
//       )}
//     </div>
//   );
// };
