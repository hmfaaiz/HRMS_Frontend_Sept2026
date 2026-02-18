import React, { useEffect, useMemo } from "react";
import { useFormUIContext } from "../FormUIContext";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import CommentCard from "./CommentCard";
import { LoaderCircleIcon } from "lucide-react";

const CommentsList = () => {
  const formUIContext = useFormUIContext() || {};

  const {
    commentsFilter,
    setCommentForm,
    setDeleteModal,
    setCommentsFilter,
  } = useMemo(() => {
    return {
      commentsFilter: formUIContext?.commentsFilter,
      setCommentForm: formUIContext?.setCommentForm,
      setDeleteModal: formUIContext?.setDeleteModal,
      setCommentsFilter: formUIContext?.setCommentsFilter,
    };
  }, [formUIContext]);
  const dispatch = useDispatch();

  const { commentsList, userId, userAccess, actionsLoading } = useSelector(
    (state) => {
      return {
        commentsList: state?.ticket_activity_portal?.commentsList,
        actionsLoading: state?.ticket_activity_portal?.actionsLoading,
        userId: state?.auth?.user?.Id,
        userAccess: state?.auth?.userAccess["ticket_activity_portal"],
      };
    },
  );
  const isAccessForAddOrUpdate = userAccess?.find(
    (el) => el?.componentName === "UpdateTicketComment",
  )?.isAccess;
  const isAccessForDelete = userAccess?.find(
    (el) => el?.componentName === "DeleteTicketComment",
  )?.isAccess;
  useEffect(() => {
    const shouldFetch =
      commentsFilter?.projectId &&
      commentsFilter?.ticketId &&
      commentsFilter?.ticketTypeId;

    if (shouldFetch) {
      dispatch(actions.fetchTicketComments(commentsFilter));
    }
  }, [
    commentsFilter?.projectId,
    commentsFilter?.ticketId,
    commentsFilter?.ticketTypeId,
    dispatch,
  ]);

  return (
    <div className="flex flex-col gap-2 max-h-[520px] overflow-y-scroll scrollbar-fancy">
      {commentsList?.map((e, i) => {
        return (
          <div
            className={
              e?.userId == userId ? "flex justify-start" : "flex justify-end"
            }
          >
            <div className={"max-w-[60%]"}>
              <CommentCard
                data={e}
                key={e?.Id}
                userId={userId}
                onEdit={(val) => {
                  setCommentForm(val);
                }}
                onDelete={(e) => {
                  setDeleteModal(e?.Id);
                }}
                isAccessForDelete={isAccessForDelete}
                isAccessForAddOrUpdate={isAccessForAddOrUpdate}
              />
            </div>
          </div>
        );
      })}
      {commentsList?.length / Number(commentsFilter?.page) == 10 ? (
        <button
          type="button"
          className="btn btn-primary m-auto"
          title="Refresh"
          disabled={
            !commentsFilter?.projectId ||
            !commentsFilter?.ticketTypeId ||
            !commentsFilter?.ticketId ||
            actionsLoading
          }
          onClick={() => {
            setCommentsFilter({
              ...commentsFilter,
              page: commentsFilter.page + 1,
            });
            dispatch(
              actions.fetchTicketComments({
                ...commentsFilter,
                page: commentsFilter.page + 1,
              }),
            );
          }}
        >
          Load More <LoaderCircleIcon className="w-4 h-4 mr-1" />
        </button>
      ) : null}
    </div>
  );
};

export default CommentsList;
