import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import axiosClient from "../axios";
import TButton from "../components/core/TButton";
import PageComponent from "../components/PageComponent";
import PaginationLinks from "../components/PaginationLinks";
import ApplicationListItem from "../components/ApplicationListItem";
import { useStateContext } from "../contexts/ContextProvider";
import router from "../router";

export default function YourApplications() {
  const { showToast } = useStateContext();
  const [applications, setApplications] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(false);

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
    url = url || "/application/user";
    setLoading(true);
    axiosClient.get(url).then(({ data }) => {
      setApplications(data.data);
      setMeta(data.meta);
      setLoading(false);
    });
  };

  useEffect(() => {
    getApplications();
  }, []);

  return (
    <PageComponent
      title="Your Job Posts"
      buttons={
        <TButton  to="/applications/create">
          <PlusCircleIcon className="h-6 w-6 mr-2" />
          Create new
        </TButton>
      }
    >
      {loading && <div className="text-center text-lg">Loading...</div>}
      {!loading && (
        <div>
          {applications.length === 0 && (
            <div className="py-8 text-center text-gray-700">
              You don't have any job posts created
            </div>
          )}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
            {applications.map((application) => (
              <ApplicationListItem
                application={application}
                key={application.id}
                onDeleteClick={onDeleteClick}
                pageType={"yours"}
              />
            ))}
          </div>
          {applications.length > 0 && <PaginationLinks meta={meta} onPageClick={onPageClick} />}
        </div>
      )}
    </PageComponent>
  );
}
