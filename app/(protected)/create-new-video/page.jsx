import React from "react";
import Topic from "./_components/Topic";

const CreateNewVideo = () => {
  return (
    <div className="mt-6 mx-6">
      <h2 className="font-semibold text-3xl">Create New Video</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

        <div className="col-span-2 p-7 border rounded-xl">
          {/* topic and script */}
          <Topic />
          {/* video image style */}

          {/* voice */}

          {/* Captions */}
        </div>

        <div></div>
      </div>
    </div>
  );
};

export default CreateNewVideo;
