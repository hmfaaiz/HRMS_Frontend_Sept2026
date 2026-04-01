import React from "react";
import { Trash2, Paperclip, Edit } from "lucide-react";
import { getUploadUrl } from "../../../../../utils/common";

export default function CommentCard({
  data,
  isAccessForDelete = false,
  isAccessForAddOrUpdate = false,
  onEdit,
  onDelete,
  userId,
}) {
  const employee = data?.Employee;
  const employeeName = employee
    ? `${employee?.firstName || ""}${
        employee?.middleName ? " " + employee.middleName : ""
      }${employee?.lastName ? " " + employee.lastName : ""}`.trim()
    : data?.customerUserId
    ? `${data?.CustomerUser?.name}`
    : "Unknown";

  const employeeCode = employee?.employeeCode || "Customer";

  const createdAt = data?.createdAt ? new Date(data.createdAt) : null;
  const updatedAt = data?.updatedAt ? new Date(data.updatedAt) : null;

  const createdText = createdAt ? formatDateTime(createdAt) : "-";
  const updatedText = updatedAt ? formatDateTime(updatedAt) : "-";

  //  show Edited only if timestamps are different
  const isEdited =
    createdAt && updatedAt && createdAt.getTime() !== updatedAt.getTime();

  const fileName = data?.file || "";
  const fileHref = fileName ? `/${fileName}` : null;

  return (
    <div
      className={"w-full max-w-3xl rounded-lg bg-tsecondary shadow-sm p-2"}
      style={
        data?.userId == userId
          ? { border: "1px solid" }
          : { border: "1px solid #ea6626 !important" }
      }
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1">
            <span className="font-medium text-black">{employeeName}</span>

            {employeeCode && (
              <span className="rounded-md bg-tprimary px-2 py-0.5 text-xs font-normal text-white">
                {employeeCode}
              </span>
            )}
          </div>

          <div className="mt-1 text-xs text-gray-500">{createdText}</div>
        </div>

        {/* Actions */}

        <div className="flex items-center gap-1">
          {fileHref && (
            <a
              href={getUploadUrl(fileHref)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border bg-white "
              title="Attachment"
            >
              <Paperclip className="h-4 w-4 text-gray-600" />
            </a>
          )}
          {isAccessForAddOrUpdate && data?.userId == userId && (
            <button
              onClick={() => onEdit?.(data)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border bg-white "
              title="Edit"
            >
              <Edit className="h-4 w-4 text-gray-700" />
            </button>
          )}

          {isAccessForDelete && data?.userId == userId && (
            <button
              onClick={() => onDelete?.(data)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border bg-white hover:bg-red-50"
              title="Delete"
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </button>
          )}
        </div>
      </div>

      {/* Comment Body */}
      <div className="mt-1 whitespace-pre-wrap rounded-lg bg-gray-50 p-2 text-sm text-black">
        {data?.comment || "-"}
      </div>

      {/* Footer */}
      {isEdited && (
        <div className="mt-2 flex justify-end text-xs text-gray-500">
          {isEdited ? `Edited ${updatedText}` : "-"}
        </div>
      )}
    </div>
  );
}

/* ================= Helpers ================= */

function formatDateTime(date) {
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
