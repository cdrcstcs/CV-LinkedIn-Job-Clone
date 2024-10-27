import { ArrowTopRightOnSquareIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import React from "react";
import TButton from "./core/TButton";

export default function SurveyItem({ survey, onDeleteClick }) {
  return (
    <div className="flex flex-col py-6 px-5 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300">
      <img
        src={survey.image_url}
        alt={survey.title}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <h4 className="mt-4 text-lg font-semibold">{survey.title}</h4>
      <div
        dangerouslySetInnerHTML={{ __html: survey.description }}
        className="overflow-hidden flex-1 text-gray-700"
      ></div>

      <div className="flex flex-col mt-4">
        <TButton
          to={`/surveys/${survey.id}`}
        >
          <PencilIcon className="w-5 h-5 mr-2" />
          Edit Survey
        </TButton>
        <div className="flex justify-between items-center">
          <TButton href={`/view/survey/${survey.slug}`} circle link>
            <ArrowTopRightOnSquareIcon className="w-5 h-5" />
          </TButton>

          {survey.id && (
            <TButton onClick={ev => onDeleteClick(survey.id)} circle link color="red">
              <TrashIcon className="w-5 h-5" />
            </TButton>
          )}
        </div>
      </div>
      
    </div>
  );
}
