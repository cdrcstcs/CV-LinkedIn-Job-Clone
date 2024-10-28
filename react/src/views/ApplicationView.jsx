import {  PhotoIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import TButton from "../components/core/TButton.jsx";
import PageComponent from "../components/PageComponent.jsx";
import axiosClient from "../axios.js";
import { useNavigate, useParams } from "react-router-dom";
import ApplicationQuestions from "../components/ApplicationQuestions.jsx";
import { v4 as uuidv4 } from "uuid";
import { useEffect } from "react";
import { useStateContext } from "../contexts/ContextProvider.jsx";

export default function ApplicationView() {
  const { showToast } = useStateContext();
  const navigate = useNavigate();
  const { id } = useParams();

  const [application, setApplication] = useState({
    title: "",
    slug: "",
    status: false,
    description: "",
    image: null,
    image_url: null,
    expire_date: "",
    questions: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onImageChoose = (ev) => {
    const file = ev.target.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      setApplication({
        ...application,
        image: file,
        image_url: reader.result,
      });

      ev.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (ev) => {
    ev.preventDefault();

    const payload = { ...application };
    if (payload.image) {
      payload.image = payload.image_url;
    }
    delete payload.image_url;
    let res = null;
    if (id) {
      res = axiosClient.put(`/application/${id}`, payload);
    } else {
      res = axiosClient.post("/application", payload);
    }

    res
      .then((res) => {
        console.log(res);
        navigate("/yours");
        if (id) {
          showToast("The application was updated");
        } else {
          showToast("The application was created");
        }
      })
      .catch((err) => {
        if (err && err.response) {
          setError(err.response.data.message);
        }
        console.log(err, err.response);
      });
  };

  function onQuestionsUpdate(questions) {
    setApplication({
      ...application,
      questions,
    });
  }

  const addQuestion = () => {
    application.questions.push({
      id: uuidv4(),
      type: "text",
      question: "",
      description: "",
      data: {},
    });
    setApplication({ ...application });
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      axiosClient.get(`/application/${id}`).then(({ data }) => {
        setApplication(data.data);
        setLoading(false);
      });
    }
  }, []);


  return (
    <PageComponent
      title={!id ? "Create new Application" : "Update Application"}
    >
      {loading && <div className="text-center text-lg">Loading...</div>}
      {!loading && (
        <form action="#" method="POST" onSubmit={onSubmit}>
          <div className="shadow sm:overflow-hidden sm:rounded-md">
            <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
              {error && (
                <div className="bg-red-500 text-white py-3 px-3">{error}</div>
              )}

              {/*Image*/}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Photo
                </label>
                <div className="mt-1 flex items-center">
                  {application.image_url && (
                    <img
                      src={application.image_url}
                      alt=""
                      className="w-32 h-32 object-cover"
                    />
                  )}
                  {!application.image_url && (
                    <span className="flex justify-center  items-center text-gray-400 h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                      <PhotoIcon className="w-8 h-8" />
                    </span>
                  )}
                  <button
                    type="button"
                    className="relative ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <input
                      type="file"
                      className="absolute left-0 top-0 right-0 bottom-0 opacity-0"
                      onChange={onImageChoose}
                    />
                    Change
                  </button>
                </div>
              </div>
              {/*Image*/}

              {/*Title*/}
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Application Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={application.title}
                  onChange={(ev) =>
                    setApplication({ ...application, title: ev.target.value })
                  }
                  placeholder="Application Title"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              {/*Title*/}

              {/*Description*/}
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                {/* <pre>{ JSON.stringify(application, undefined, 2) }</pre> */}
                <textarea
                  name="description"
                  id="description"
                  value={application.description || ""}
                  onChange={(ev) =>
                    setApplication({ ...application, description: ev.target.value })
                  }
                  placeholder="Describe your application"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                ></textarea>
              </div>
              {/*Description*/}

              {/*Expire Date*/}
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="expire_date"
                  className="block text-sm font-medium text-gray-700"
                >
                  Expire Date
                </label>
                <input
                  type="date"
                  name="expire_date"
                  id="expire_date"
                  value={application.expire_date}
                  onChange={(ev) =>
                    setApplication({ ...application, expire_date: ev.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              {/*Expire Date*/}

              {/*Active*/}
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="status"
                    name="status"
                    type="checkbox"
                    checked={application.status}
                    onChange={(ev) =>
                      setApplication({ ...application, status: ev.target.checked })
                    }
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="comments"
                    className="font-medium text-gray-700"
                  >
                    Active
                  </label>
                  <p className="text-gray-500">
                    Whether to make application publicly available
                  </p>
                </div>
              </div>
              {/*Active*/}

              <button type="button" onClick={addQuestion}>
                Add question
              </button>
              <ApplicationQuestions
                questions={application.questions}
                onQuestionsUpdate={onQuestionsUpdate}
              />
            </div>
            <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
              <TButton>Save</TButton>
            </div>
          </div>
        </form>
      )}
    </PageComponent>
  );
}
