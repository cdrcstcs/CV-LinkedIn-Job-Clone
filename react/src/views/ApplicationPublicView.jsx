import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../axios";
import PublicQuestionView from "../components/PublicQuestionView";

export default function ApplicationPublicView() {
  const answers = {};
  const [applicationFinished, setApplicationFinished] = useState(false);
  const [application, setApplication] = useState({ questions: [] });
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
  }, [slug]);

  function answerChanged(question, value) {
    answers[question.id] = value;
  }

  function onSubmit(ev) {
    ev.preventDefault();

    axiosClient
      .post(`/application/${application.id}/answer`, { answers })
      .then(() => {
        setApplicationFinished(true);
      });
  }

  return (
    <div className="container mx-auto p-4">
      {loading && <div className="flex justify-center text-lg">Loading...</div>}
      {!loading && (
        <form onSubmit={onSubmit} className="bg-white shadow-md rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex justify-center">
              <img
                src={application.image_url}
                alt=""
                className="w-full h-auto aspect-[2/1] object-cover rounded-lg shadow-lg"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold mb-2">{application.title}</h1>
              <p className="text-gray-500 text-sm mb-1">Expire Date: {application.expire_date}</p>
              <p className="text-gray-700 mb-4">{application.description}</p>
            </div>
          </div>

          {applicationFinished && (
            <div className="py-4 px-4 bg-blue-600 text-white rounded-lg mb-4">
              Thank you for participating in the application!
            </div>
          )}

          {!applicationFinished && (
            <>
              <h2 className="text-lg font-semibold mb-4">Questions</h2>
              {application.questions.map((question, index) => (
                <PublicQuestionView
                  key={question.id}
                  question={question}
                  index={index}
                  answerChanged={(val) => answerChanged(question, val)}
                />
              ))}
              <button
                type="submit"
                className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
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
