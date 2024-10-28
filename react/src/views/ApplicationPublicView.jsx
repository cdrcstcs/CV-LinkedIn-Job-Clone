import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../axios";
import PublicQuestionView from "../components/PublicQuestionView";

export default function ApplicationPublicView() {
  const answers = {};
  const [applicationFinished, setApplicationFinished] = useState(false);
  const [application, setApplication] = useState({
    questions: [],
  });
  const [loading, setLoading] = useState(false);
  const { slug } = useParams();

  useEffect(() => {
    setLoading(true);
    axiosClient
      .get(`application/get-by-slug/${slug}`)
      .then(({ data }) => {
        setLoading(false);
        setApplication(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  function answerChanged(question, value) {
    answers[question.id] = value;
    console.log(question, value);
  }

  function onSubmit(ev) {
    ev.preventDefault();

    console.log(answers);
    axiosClient
      .post(`/application/${application.id}/answer`, {
        answers,
      })
      .then((response) => {
        debugger;
        setApplicationFinished(true);
      });
  }

  return (
    <div>
      {loading && <div className="flex justify-center">Loading..</div>}
      {!loading && (
        <form onSubmit={(ev) => onSubmit(ev)} className="container mx-auto p-4">
          <div className="grid grid-cols-6">
            <div className="mr-4">
              <img src={application.image_url} alt="" />
            </div>

            <div className="col-span-5">
              <h1 className="text-3xl mb-3">{application.title}</h1>
              <p className="text-gray-500 text-sm mb-3">
                Expire Date: {application.expire_date}
              </p>
              <p className="text-gray-500 text-sm mb-3">{application.description}</p>
            </div>
          </div>

          {applicationFinished && (
            <div className="py-8 px-6 bg-blue-600 text-white w-[600px] mx-auto">
              Thank you for participating in the application
            </div>
          )}
          {!applicationFinished && (
            <>
              <div>
                {application.questions.map((question, index) => (
                  <PublicQuestionView
                    key={question.id}
                    question={question}
                    index={index}
                    answerChanged={(val) => answerChanged(question, val)}
                  />
                ))}
              </div>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Submit
              </button>
            </>
          )}
        </form>
      )}
    </div>
  );
}
