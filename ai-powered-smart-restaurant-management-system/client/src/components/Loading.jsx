import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      <p className="text-gray-600 font-medium">{message}</p>
    </div>
  );
};

export default Loading;