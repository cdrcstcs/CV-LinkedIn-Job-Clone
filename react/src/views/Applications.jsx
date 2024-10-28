import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation to access URL parameters
import axiosClient from "../axios";
import TButton from "../components/core/TButton";
import PageComponent from "../components/PageComponent";
import PaginationLinks from "../components/PaginationLinks";
import ApplicationListItem from "../components/ApplicationListItem";
import { useStateContext } from "../contexts/ContextProvider";

export default function Applications() {
  const { showToast } = useStateContext();
  const [applications, setApplications] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(false);
  
  const location = useLocation(); // Get the current location
  const searchParams = new URLSearchParams(location.search); // Extract query parameters
  const search = searchParams.get('search') || ""; // Get the search value
  const sort = searchParams.get('sort') || "latest"; // Get the sort value

  const onDeleteClick = (id) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      axiosClient.delete(`/application/${id}`).then(() => {
        getApplications();
        showToast('The application was deleted');
      });
    }
  };

  const onPageClick = (link) => {
    getApplications(link.url);
  };

  const getApplications = (url) => {
    url = url || `/application?search=${search}&sort=${sort}`; // Construct the URL with search and sort
    setLoading(true);
    axiosClient.get(url).then(({ data }) => {
      setApplications(data.data);
      setMeta(data.meta);
      setLoading(false);
    }).catch(() => {
      setLoading(false); // Ensure loading is false on error
    });
  };

  useEffect(() => {
    getApplications(); // Fetch applications on mount and when parameters change
  }, [search, sort]); // Add search and sort to dependency array

  return (
    <PageComponent title="All Jobs" pageType="all">
      {loading && <div className="text-center text-lg">Loading...</div>}
      {!loading && (
        <div>
          {applications.length === 0 && (
            <div className="py-8 text-center text-gray-700">
              There are no jobs currently
            </div>
          )}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
            {applications.map((application) => (
              <ApplicationListItem
                application={application}
                key={application.id}
                onDeleteClick={onDeleteClick}
              />
            ))}
          </div>
          {applications.length > 0 && (
            <PaginationLinks meta={meta} onPageClick={onPageClick} />
          )}
        </div>
      )}
    </PageComponent>
  );
}
