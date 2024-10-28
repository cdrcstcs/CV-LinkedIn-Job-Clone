import {CheckCircleIcon, ArrowTopRightOnSquareIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import React from "react";
import TButton from "./core/TButton";

export default function ApplicationItem({ application, onDeleteClick, pageType }) {
  return (
    <div className="flex flex-col py-6 px-5 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300">
      <img
        src={application.image_url}
        alt={application.title}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <h4 className="mt-4 text-lg font-semibold">{application.title}</h4>
      <div
        dangerouslySetInnerHTML={{ __html: application.description }}
        className="overflow-hidden flex-1 text-gray-700"
      ></div>

      <div className="flex flex-col mt-4">
        {pageType == 'yours'? (<TButton
          to={`/applications/${application.id}`}
        >
          <PencilIcon className="w-5 h-5 mr-2" />
          Edit Application
        </TButton>) : null }
        {pageType == 'yours'?(<div className="my-2 h-1"></div>):null}
        <TButton href={`/application/public/${application.slug}`}>
          <CheckCircleIcon className="w-6 h-6 mr-2" />
          {pageType == 'yours'? "Share" : "Easy Apply"}
        </TButton>
        <div className="flex justify-between items-center">
          <TButton href={`/view/application/${application.slug}`} circle link>
            <ArrowTopRightOnSquareIcon className="w-5 h-5" />
          </TButton>

          {application.id && (
            <TButton onClick={ev => onDeleteClick(application.id)} circle link color="red">
              <TrashIcon className="w-5 h-5" />
            </TButton>
          )}
        </div>
      </div>
      
    </div>
  );
}
