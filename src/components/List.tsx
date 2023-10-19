// import { useState } from "react";

// type Badge = {
//   name: string;
//   finished: boolean;
// };

// export const ListInput = ({
//   list,
//   updateList,
//   badgeColor,
//   badgeTextColor = "text-black",
//   placeholder,
//   isEvents = false,
// }: any) => {
//   const [newItem, updateNewItem] = useState<any>("");

//   const addNewItem = (item: string, finished = false) => {
//     var curList = list;
//     curList.push({
//       name: item,
//       finished,
//     });
//     updateList(curList);
//   };

//   const updateFinished = (item: Badge, finished: boolean) => {
//     var curList = list;
//     var i = curList.indexOf(item);
//     curList[i].finished = finished;
//     updateList(curList);
//   };

//   const removeItem = (item: Badge) => {
//     var curList = list;
//     var i = curList.indexOf(item);
//     curList.splice(i, 1);
//     updateList(curList);
//   };

//   return (
//     <div className={`flex flex-row flex-wrap gap-2 w-full`} ref={drop}>
//       {list.map((x: Badge) => (
//         <ListItem
//           key={x.name}
//           text={x.name}
//           badgeColor={badgeColor}
//           badgeTextColor={badgeTextColor}
//           onRemove={() => removeItem(x)}
//           finished={x.finished}
//           updateFinished={(y: boolean) => updateFinished(x, y)}
//           isEvent={isEvents}
//         />
//       ))}

//       <input
//         type="text"
//         enterKeyHint="done"
//         value={newItem}
//         className="bg-gray-900 rounded-md border p-1 border-gray-400 text-slate-300 w-full max-w-2xs"
//         placeholder={placeholder}
//         onKeyDown={(e) => {
//           if (e.key === "Enter") {
//             addNewItem(newItem);
//             updateNewItem("");
//           }
//         }}
//         onChange={(e) => updateNewItem(e.target.value)}
//       />
//     </div>
//   );
// };

// const ListItem = ({
//   badgeColor,
//   badgeTextColor,
//   text,
//   onRemove,
//   finished,
//   updateFinished,
//   isEvent = false,
// }: any) => {
//   const [hover, updateHover] = useState(false);
//   const [, dragRef] = useDrag(
//     () => ({
//       type: isEvent ? "EventItem" : "TaskItem",
//       item: { text, finished },
//       end: (item, monitor) => monitor.didDrop() && onRemove(),
//     }),
//     [finished]
//   );

//   const handleClick = (e: any) => {
//     if (e.type === "click") {
//       if (finished) onRemove();
//       else updateFinished(true);
//     } else if (e.type === "contextmenu") {
//       e.preventDefault();
//       finished && updateFinished(false);
//     }
//   };

//   const determineIcon = () => {
//     var index = ~~finished + ~~hover;
//     if (!index) return <AiOutlineCheckCircle />;
//     if (index === 1) return <AiFillCheckCircle />;
//     else return <AiFillCloseCircle />;
//   };

//   var badgeStyle =
//     (finished
//       ? `rounded-xl flex flex-row gap-2 align-center bg-green-700 cursor-pointer`
//       : ` rounded-xl flex flex-row gap-2 align-center ${badgeColor} cursor-pointer`) +
//     ` ${badgeTextColor} border border-black rounded-draggable` +
//     (isEvent ? " py-2 px-3" : " py-1 px-2");

//   var textStyle =
//     (finished && !hover ? "opacity-80" : "") +
//     (isEvent ? " font-semibold" : "");

//   return (
//     <div
//       className={badgeStyle}
//       onClick={handleClick}
//       onContextMenu={handleClick}
//       onMouseOver={() => updateHover(true)}
//       onMouseOut={() => updateHover(false)}
//       ref={dragRef}
//     >
//       <p className={textStyle}>{text}</p>
//       <div className="my-auto">{determineIcon()}</div>
//     </div>
//   );
// };
