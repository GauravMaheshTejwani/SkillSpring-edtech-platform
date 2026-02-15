import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteSection,
  deleteSubSection,
} from "../../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../../slices/courseSlice";
import { RxDropdownMenu } from "react-icons/rx";
import { VscAdd, VscEdit, VscTrash, VscTriangleDown } from "react-icons/vsc";
import SubSectionModal from "./SubSectionModal";

const NestedView = ({ handleChangeEditSectionName }) => {
  const { token } = useSelector((state) => state.auth);
  const { course } = useSelector((state) => state.course);
  const dispatch = useDispatch();

  const [addSubSection, setAddSubSection] = useState(null);
  const [editSubSection, setEditSubSecion] = useState(null);
  const [viewSubSection, setViewSubSecion] = useState(null);

  const [confirmationModal, setConfirmationModal] = useState(null);

  const handleDeleteSection = async (sectionId) => {
    const result = await deleteSection(
      { sectionId, courseId: course._id },
      token,
    );
    if (result) {
      dispatch(setCourse(result));
      setConfirmationModal(null);
    }
  };

  const handleDeleteSubSection = async (subSectionId, sectionId) => {
    const result = await deleteSubSection(
      { subSectionId, sectionId, courseId: course._id },
      token,
    );
    if (result) {
      dispatch(setCourse(result));
      setConfirmationModal(null);
    }
  };

  return (
    <div>
      <div>
        {course.courseContent.map((section) => (
          <details key={section._id} className="mt-4">
            <summary className="flex cursor-pointer items-center justify-between border-b-2 border-b-gray-600 py-2">
              <div className="flex items-center gap-x-3">
                <RxDropdownMenu size={25} className=" text-gray-400" />
                <p className="font-semibold text-gray-400">{section.name}</p>
              </div>

              <div className="flex items-center gap-x-3">
                <button>
                  <VscEdit
                    className="text-lg text-gray-400 "
                    onClick={handleChangeEditSectionName(
                      section._id,
                      section.sectionName,
                    )}
                  />
                </button>
                <button>
                  <VscTrash
                    className="text-lg text-gray-400"
                    onClick={() => {
                      setConfirmationModal({
                        text1: "Are you sure you want to delete this Section?",
                        text2:
                          "All the lectures in this section will be deleted",
                        btn1Text: "Delete",
                        btn2Text: "Cancel",
                        btn1Handler: () => handleDeleteSection(section._id),
                        btn2Handler: () => setConfirmationModal(null),
                      });
                    }}
                  />
                </button>
                <span className="font-medium text-gray-500">|</span>
                <VscTriangleDown className="text-lg text-gray-400" />
              </div>
            </summary>

            <div className="px-6 pb-4">
              {section?.SubSection.map((subSection) => (
                <div
                  onClick={(e) => {
                    if (e.currentTarget != e.target) return;
                    setViewSubSecion(subSection);
                  }}
                  key={subSection._id}
                  className="flex cursor-pointer items-center justify-between gap-x-3 border-b-2 border-b-gray-600 py-2 z-0"
                >
                  <div className="flex items-center gap-x-3">
                    <RxDropdownMenu size={25} className=" text-gray-400" />
                    <p className="font-semibold text-gray-400">
                      {subSection.title}
                    </p>
                  </div>

                  <div className="flex items-center gap-x-3">
                    <button>
                      <VscEdit
                        className="text-lg text-gray-400 z-50"
                        onClick={() => {
                          setEditSubSecion(subSection);
                        }}
                      />
                    </button>

                    <button>
                      <VscTrash
                        className="text-lg text-gray-400 z-50"
                        size={21}
                        onClick={() => {
                          setConfirmationModal({
                            text1:
                              "Are you sure you want to delete this subSection?",
                            text2:
                              "Selected lecture will be deleted permanently",
                            btn1Text: "Delete",
                            btn2Text: "Cancel",
                            btn1Handler: () =>
                              handleDeleteSubSection(
                                subSection._id,
                                section._id,
                              ),
                            btn2Handler: () => setConfirmationModal(null),
                          });
                        }}
                      />
                    </button>
                  </div>
                </div>
              ))}

              <button
                className="mt-3 flex items-center gap-x-1 text-yellow-400 font-bold"
                onClick={()=>setAddSubSection(section._id)}
              >
                <VscAdd className="text-lg text-yellow-400 " />
                <p>Add Lecture</p>
              </button>
            </div>
          </details>
        ))}
      </div>

      {addSubSection ? (
        <SubSectionModal
          modalData={addSubSection}
          setModalData={setAddSubSection}
          add={true}
        />
      ) : editSubSection ? (
        <SubSectionModal
          modalData={editSubSection}
          setModalData={setEditSubSecion}
          edit={true}
        />
      ) : viewSubSection ? (
        <SubSectionModal
          modalData={viewSubSection}
          setModalData={setViewSubSecion}
          view={true}
        />
      ) : null}

      {confirmationModal && (
        <confirmationModal
          modalData={confirmationModal}
          setConfirmationModal={setConfirmationModal}
        />
      )}
    </div>
  );
};

export default NestedView;
