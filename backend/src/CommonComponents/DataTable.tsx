// //@ts-nocheck
// import { capitalizeHeader } from "@/lib/utils";
// import dynamic from "next/dynamic";
// import Image from "next/image";
// import { Fragment, useEffect, useState } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import {
//   Button,
//   Form,
//   FormGroup,
//   Input,
//   Label,
//   Modal,
//   ModalBody,
//   ModalFooter,
//   ModalHeader,
// } from "reactstrap";
// const DataTable = dynamic(() => import("react-data-table-component"), {
//   ssr: false,
// });

// const Datatable = ({
//   showId = true,
//   myData,
//   myClass,
//   multiSelectOption,
//   pagination,
//   isEditable,
//   isDelete,
//   handleOnClick,
//   onClickField,
//   loading,
//   onDelete,
//   handleOpenEditModal,
// }: any) => {
//   useEffect(() => {
//     setData(myData);
//     // console.log("myData", myData);
//   }, [myData]);

//   // const [open, setOpen] = useState(false);
//   const [checkedValues, setCheckedValues] = useState([]);
//   const [data, setData] = useState(myData);
//   const selectRow = (e, i) => {
//     if (!e.target.checked) {
//       setCheckedValues(checkedValues.filter((item, j) => i !== item));
//     } else {
//       checkedValues.push(i);
//       setCheckedValues(checkedValues);
//     }
//   };

//   const handleRemoveRow = () => {
//     const updatedData = myData.filter(function (el) {
//       return checkedValues.indexOf(el.id) < 0;
//     });
//     setData([...updatedData]);
//     toast.success("Successfully Deleted !");
//   };

//   const renderEditable = (cellInfo) => {
//     return (
//       <div
//         style={{ backgroundColor: "#fafafa" }}
//         contentEditable
//         suppressContentEditableWarning
//         onBlur={(e) => {
//           data[cellInfo.index][cellInfo.index.id] = e.target.innerHTML;
//           setData({ myData: data });
//         }}
//         dangerouslySetInnerHTML={{
//           __html: myData[cellInfo.index][cellInfo.index.id],
//         }}
//       />
//     );
//   };

//   const handleDelete = async (index: number, row: any) => {
//     if (window.confirm("Are you sure you wish to delete this item?")) {
//       const del = data;
//       del.splice(index, 1);
//       if (onDelete) {
//         const hasDeleted = await onDelete(row);
//         console.log("hasDeleted: ", hasDeleted);
//         if (hasDeleted) setData([...del]);
//       } else {
//         toast.error("On Delete function is not defined!");
//       }
//     }
//     // toast.success("Successfully Deleted !");
//   };
//   // const onOpenModal = () => {
//   //   setOpen(true);
//   // };

//   // const onCloseModal = () => {
//   //   setOpen(false);
//   // };

//   const Capitalize = (str: string) => {
//     return str.charAt(0).toUpperCase() + str.slice(1);
//   };

//   const columns = [];
//   for (const key in myData[0]) {
//     if (key === "_id" && !showId) {
//       continue;
//     }

//     let editable = renderEditable;
//     if (key === "image") {
//       editable = null;
//     }
//     if (key === "status") {
//       editable = null;
//     }
//     if (key === "avtar") {
//       editable = null;
//     }
//     if (key === "profile_image") {
//       editable = null;
//     }
//     if (key === "vendor") {
//       editable = null;
//     }
//     if (key === "order_status") {
//       editable = null;
//     }

//     columns.push({
//       name: <b>{capitalizeHeader(key.toString())}</b>,
//       header: <b>{capitalizeHeader(key.toString())}</b>,
//       selector: (row) => {
//         if (typeof row[key] === "object" && row[key] !== null) {
//           return JSON.stringify(row[key]);
//         }
//         return row[key];
//       },
//       cell: (row) => {
//         if (
//           key === "image_link" ||
//           key === "profile_image" ||
//           key === "image"
//         ) {
//           return (
//             <div style={{ textAlign: "center" }}>
//               <Image
//                 src={row[key]}
//                 alt="Product Image"
//                 width={100}
//                 height={80}
//                 style={{ width: "60px", height: "60px", objectFit: "cover" }}
//               />
//             </div>
//           );
//         }
//         if (key === onClickField) {
//           // console.log("row[key]: ", row);
//           return (
//             <div
//               style={{
//                 cursor: "pointer",
//                 color: "blue",
//                 textDecorationLine: "underline",
//               }}
//               onClick={() => handleOnClick(row)}
//             >
//               {row[key]}
//             </div>
//           );
//         } // key === "_id" && !showId ? null :
//         return row[key] || "-";
//       },
//       Cell: editable,
//       style: {
//         textAlign: "center",
//       },
//     });
//   }

//   if (multiSelectOption === true) {
//     columns.push({
//       name: (
//         <Button
//           color="danger"
//           size="sm"
//           className=" btn-delete mb-0 b-r-4"
//           onClick={(e) => {
//             if (window.confirm("Are you sure you wish to delete this item?"))
//               handleRemoveRow();
//           }}
//         >
//           Delete
//         </Button>
//       ),
//       id: "delete",
//       accessor: () => "delete",
//       cell: (row) => (
//         <div>
//           <span>
//             <Input
//               type="checkbox"
//               name={row.id}
//               defaultChecked={checkedValues.includes(row.id)}
//               onChange={(e) => selectRow(e, row.id)}
//             />
//           </span>
//         </div>
//       ),
//       style: {
//         textAlign: "center",
//       },
//       sortable: false,
//     });
//   } else if (isEditable || isDelete) {
//     columns.push({
//       name: <b>Action</b>,
//       id: "delete",
//       accessor: (str) => "delete",
//       cell: (row, index) => (
//         <div>
//           {isDelete && (
//             <span onClick={() => handleDelete(index, row)}>
//               <i
//                 className="fa fa-trash"
//                 style={{
//                   width: 35,
//                   fontSize: 20,
//                   padding: 11,
//                   color: "#e4566e",
//                   cursor: "pointer",
//                 }}
//               ></i>
//             </span>
//           )}
//           {isEditable && (
//             <span>
//               <i
//                 onClick={() => {
//                   if (handleOpenEditModal) {
//                     // if (
//                     //   window.confirm(
//                     //     "Are you sure you wish to edit this item? You will be redirect to its edit page."
//                     //   )
//                     // )
//                       handleOpenEditModal(row);
//                   } else {
//                     toast.error("Edit function is not defined!");
//                   }
//                 }}
//                 className="fa fa-pencil"
//                 style={{
//                   width: 35,
//                   fontSize: 20,
//                   padding: 11,
//                   color: "rgb(40, 167, 69)",
//                   cursor: "pointer",
//                 }}
//               ></i>
//               {/* <Modal isOpen={open} toggle={onCloseModal} style={{ overlay: { opacity: 0.1 } }}>
//                 <ModalHeader toggle={onCloseModal}>
//                   <h5 className="modal-title f-w-600" id="exampleModalLabel2">
//                     Edit Product
//                   </h5>
//                 </ModalHeader>
//                 <ModalBody>
//                   <Form>
//                     <FormGroup>
//                       <Label htmlFor="recipient-name" className="col-form-label">
//                         Category Name :
//                       </Label>
//                       <Input type="text" />
//                     </FormGroup>
//                     <FormGroup>
//                       <Label htmlFor="message-text" className="col-form-label">
//                         Category Image :
//                       </Label>
//                       <Input id="validationCustom02" type="file" />
//                     </FormGroup>
//                   </Form>
//                 </ModalBody>
//                 <ModalFooter>
//                   <Button type="button" color="primary" onClick={() => onCloseModal("VaryingMdo")}>
//                     Update
//                   </Button>
//                   <Button type="button" color="secondary" onClick={() => onCloseModal("VaryingMdo")}>
//                     Close
//                   </Button>
//                 </ModalFooter>
//               </Modal> */}
//             </span>
//           )}
//         </div>
//       ),
//       style: {
//         textAlign: "center",
//       },
//       sortable: false,
//     });
//   }

//   useEffect(() => {
//     console.log("loading: ", loading);
//   }, [loading]);
//   return (
//     <div>
//       <Fragment>
//         {loading ? (
//           <div>Loading...</div>
//         ) : (
//           <DataTable
//             data={data}
//             columns={columns}
//             className={myClass}
//             pagination={pagination}
//             striped={true}
//             center={true}
//           />
//         )}

//         <ToastContainer />
//       </Fragment>
//     </div>
//   );
// };

// export default Datatable;





//@ts-nocheck
import React, { Fragment, useEffect, useState } from "react";
import { capitalizeHeader } from "@/lib/utils";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Button,
  Input,
} from "reactstrap";

const DataTable = dynamic(() => import("react-data-table-component"), {
  ssr: false,
});

interface DatatableProps {
  showId?: boolean;
  myData: any[];
  myClass?: string;
  multiSelectOption?: boolean;
  pagination?: boolean;
  isEditable?: boolean;
  isDelete?: boolean;
  handleOnClick?: (row: any) => void;
  onClickField?: string;
  loading?: boolean;
  onDelete?: (row: any) => Promise<boolean>;
  handleOpenEditModal?: (row: any) => void;
  pageSize?: number;
  class?: string;
}

const Datatable: React.FC<DatatableProps> = ({
  showId = true,
  myData = [],
  myClass,
  multiSelectOption = false,
  pagination = true,
  isEditable = false,
  isDelete = false,
  handleOnClick,
  onClickField,
  loading = false,
  onDelete,
  handleOpenEditModal,
  pageSize = 10,
  class: customClass,
}) => {
  const [data, setData] = useState<any[]>([]);
  const [checkedValues, setCheckedValues] = useState<any[]>([]);

  // Log props for debugging
  useEffect(() => {
    console.log("Datatable Props:", {
      isDelete,
      myData: myData.length,
      loading,
    });
  }, [isDelete, myData, loading]);

  // Update data when myData changes
  useEffect(() => {
    if (myData && myData.length > 0) {
      setData(myData);
    }
  }, [myData]);

  // Handle row deletion
  const handleDelete = async (index: number, row: any) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        if (onDelete) {
          const result = await onDelete(row);
          if (result) {
            const updatedData = [...data];
            updatedData.splice(index, 1);
            setData(updatedData);
            toast.success("Item deleted successfully");
          }
        } else {
          toast.error("Delete function not provided");
        }
      } catch (error) {
        console.error("Deletion error:", error);
        toast.error("Failed to delete item");
      }
    }
  };

  // Generate columns dynamically
  const generateColumns = () => {
    if (!myData || myData.length === 0) return [];

    const columns = Object.keys(myData[0]).map((key) => {
      // Skip ID if showId is false
      if (key === "_id" && !showId) return null;

      return {
        name: capitalizeHeader(key),
        selector: (row: any) => row[key],
        sortable: true,
        cell: (row: any) => {
          // Handle image rendering
          if (
            ["image", "profile_image", "image_link"].includes(key)
          ) {
            return row[key] ? (
              <Image
                src={row[key]}
                alt={`${key} image`}
                width={60}
                height={60}
                style={{ objectFit: "cover" }}
              />
            ) : null;
          }

          // Handle clickable fields
          if (key === onClickField) {
            return (
              <div
                style={{
                  color: "blue",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
                onClick={() => handleOnClick && handleOnClick(row)}
              >
                {row[key]}
              </div>
            );
          }

          return row[key] || "-";
        },
      };
    }).filter(Boolean);

    // Add action column if delete or edit is enabled
    if (isDelete || isEditable) {
      columns.push({
        name: "Actions",
        cell: (row: any, index: number) => (
          <div style={{ display: 'flex', gap: '10px' }}>
            {isDelete && (
              <button 
                onClick={() => handleDelete(index, row)}
                style={{ 
                  background: 'red', 
                  color: 'white', 
                  border: 'none', 
                  padding: '5px 10px', 
                  cursor: 'pointer' 
                }}
              >
                Delete
              </button>
            )}
            {isEditable && (
              <button 
                onClick={() => handleOpenEditModal && handleOpenEditModal(row)}
                style={{ 
                  background: 'green', 
                  color: 'white', 
                  border: 'none', 
                  padding: '5px 10px', 
                  cursor: 'pointer' 
                }}
              >
                Edit
              </button>
            )}
          </div>
        ),
        width: '150px',
        center: true,
      });
    }

    return columns;
  };

  return (
    <Fragment>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <DataTable
          columns={generateColumns()}
          data={data}
          pagination={pagination}
          paginationPerPage={pageSize}
          className={customClass}
          striped
        />
      )}
      <ToastContainer />
    </Fragment>
  );
};

export default Datatable;