import React, { useMemo } from "react";
import { CommentForm } from "./CommentForm";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import { useFormUIContext } from "../FormUIContext";
import { uploadFile } from "../../../../Dashboard/_redux/dashboardActions";
import CommentsList from "./CommentsList";
import { RefreshCcw } from "lucide-react";
export function CommentSection() {
  const dispatch = useDispatch();
  const formUIContext = useFormUIContext();
  // extract values from read redux
  const { userAccess } = useSelector((state) => {
    return {
      userAccess: state?.auth?.userAccess["ticket_activity"],
    };
  });
  const isAccessForCommentArea = userAccess?.find(
    (el) => el?.componentName === "ReadAllTicketComments",
  )?.isAccess;

  const isAccessForCommentForm = userAccess?.find(
    (el) => el?.componentName === "UpdateTicketComment",
  )?.isAccess;

  /// extract values from context
  const {
    initVal,
    setCommentForm,
    commentsFilter,
    setCommentsFilter,
  } = useMemo(() => {
    return {
      initVal: formUIContext?.initVal,
      setCommentForm: formUIContext?.setCommentForm,
      commentsFilter: formUIContext?.commentsFilter,
      setCommentsFilter: formUIContext?.setCommentsFilter,
    };
  }, [formUIContext]);
  /// coment handle submit
  const handleSubmit = async (payload, resetForm) => {
    if (payload?.file && payload.file instanceof File) {
      try {
        const uploadResponse = await uploadFile(payload.file);

        if (uploadResponse?.data?.filename) {
          payload.file = uploadResponse.data.filename;
        } else {
          // Error handling
          console.error("File upload failed or no filename in response");
          return;
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        return;
      }
    }

    const finalPayload = {
      ...payload,
      ...commentsFilter,
    };

    dispatch(actions?.createOrUpdateTicketComments(finalPayload))
      ?.then(() => {
        resetForm();
        setCommentForm(initVal);
      })
      .catch((error) => {
        console.error("Error creating/updating comment:", error);
      });
  };

  const refreshComments = () => {
    const shouldFetch =
      commentsFilter?.projectId &&
      commentsFilter?.ticketId &&
      commentsFilter?.ticketTypeId;

    if (shouldFetch) {
      setCommentsFilter({
        ...commentsFilter,
        page: 1,
      });
      dispatch(actions.fetchTicketComments({ ...commentsFilter, page: 1 }));
    }
  };

  return (
    <>
      {commentsFilter?.ticketId &&
      commentsFilter?.ticketTypeId &&
      commentsFilter?.projectId &&
      isAccessForCommentArea ? (
        <div className="w-full overflow-x-auto h-auto min-h-32 px-3 py-2 rounded-lg bg-white mt-2">
          {isAccessForCommentForm ? (
            <CommentForm onSave={handleSubmit} />
          ) : null}
          <hr />
          <div className="flex justify-between items-center">
            <h6 className="font-bold mb-0 text-primary my-2">Comments</h6>
            <button
              type="button"
              className="btn btn-primary btn-icon"
              title="Refresh"
              disabled={
                !commentsFilter?.projectId ||
                !commentsFilter?.ticketTypeId ||
                !commentsFilter?.ticketId
              }
              onClick={refreshComments}
            >
              <RefreshCcw className="w-4 h-4" />
            </button>
          </div>
          <CommentsList />
        </div>
      ) : null}
    </>
  );
}
