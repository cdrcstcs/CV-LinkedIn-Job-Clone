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
        <img 
          src={pageType !== 'yours' ? 'https://freelogopng.com/images/all_img/1656996524linkedin-app-icon.png' : 'https://www.creativefabrica.com/wp-content/uploads/2023/04/26/share-icon-with-3d-vector-icon-Graphics-68113076-1.jpg'} 
          alt="Easy Apply" 
          className={`w-7 h-7 mr-3 ${pageType === 'yours' ? 'rounded-full' : ''}`} 
        />
          {pageType == 'yours'? "Share" : "Easy Apply"}
        </TButton>
        <div className="flex justify-end items-center">

          {application.id && pageType=='yours' &&(
            <TButton onClick={ev => onDeleteClick(application.id)} circle link color="red">
              <TrashIcon className="w-5 h-5" />
            </TButton>
          )}
        </div>
      </div>
      
    </div>
  );
}
