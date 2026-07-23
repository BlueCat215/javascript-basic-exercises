import React from "react";

export const TestTailwind = () => {
  return (
    <div>
      <h1 className="text-center text-4xl font-semibold text-black pt-3 mb-0.5">
        Live anywhere
      </h1>
      <h2 className="text-center font-light text-xl text-gray-500 mb-10">
        Kepp calm & travel on
      </h2>
      <div className="grid grid-cols-3 gap-x-8 max-w-6xl mx-auto">
        <div>
          <div className="h-96 mb-5">
            <img
              src="https://plus.unsplash.com/premium_photo-1784206120956-1cfc952d7fb4?q=80&w=685&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
              className="w-full h-full rounded-lg object-cover"
            />
          </div>
          <h3 className="text-center font-medium text-lg mb-3">
            Enjoy the great cold
          </h3>
          <span className="block text-center text-gray-400 text-sm">
            6,789 properties
          </span>
        </div>

        <div>
          <div className="h-96 mb-5">
            <img
              src="https://plus.unsplash.com/premium_photo-1784206120956-1cfc952d7fb4?q=80&w=685&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
              className="w-full h-full rounded-lg object-cover"
            />
          </div>
          <h3 className="text-center font-medium text-lg mb-3">
            Enjoy the great cold
          </h3>
          <span className="block text-center text-gray-400 text-sm">
            6,789 properties
          </span>
        </div>

        <div>
          <div className="h-96 mb-5">
            <img
              src="https://plus.unsplash.com/premium_photo-1784206120956-1cfc952d7fb4?q=80&w=685&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
              className="w-full h-full rounded-lg object-cover"
            />
          </div>
          <h3 className="text-center font-medium text-lg mb-3">
            Enjoy the great cold
          </h3>
          <span className="block text-center text-gray-400 text-sm">
            6,789 properties
          </span>
        </div>
      </div>
    </div>
  );
};
