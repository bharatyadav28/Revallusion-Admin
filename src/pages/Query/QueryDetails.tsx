import { useLocation } from "react-router-dom";

import { formatDate } from "@/lib/reusable-funs";
import { Link } from "react-router-dom";

function QueryDetails() {
  const location = useLocation();
  const query = location?.state?.query;

  const itemClasses = "flex flex-col gap-1 ";
  const itemheading = "font-semibold text-lg";
  const file = query?.file;

  return (
    <div className="main-container">
      <h2 className="text-xl font-semibold border-b-[1px] pb-4 border-gray-700">
        Query - Details
      </h2>
      <hr />

      <div className="flex flex-col gap-10">
        <div className="grid lg:grid-cols-3 gap-y-10">
          <div className={itemClasses}>
            <div className={itemheading}>Submitted By</div>
            <div>{query?.name}</div>
          </div>

          <div className={itemClasses}>
            <div className={itemheading}>Email</div>
            <div>{query?.email}</div>
          </div>

          <div className={itemClasses}>
            <div className={itemheading}>Mobile Number</div>
            <div>{query?.mobile}</div>
          </div>

          <div className={itemClasses}>
            <div className={itemheading}>Address</div>
            <div>{query?.address}</div>
          </div>

          <div className={itemClasses}>
            <div className={itemheading}>Submitted at</div>
            <div>{formatDate(query?.createdAt)}</div>
          </div>
        </div>

        <div className={itemClasses}>
          <div className={itemheading}>Message</div>
          <div>{query?.message}</div>
        </div>

        <div className={itemClasses}>
          <div className={itemheading}>File</div>
          <div className="mt-2">
            {file ? (
              <Link
                className="green-button px-3 py-2 rounded-sm text-sm"
                target="_blank"
                to={file}
              >
                View File
              </Link>
            ) : (
              "No file attached"
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QueryDetails;
