import React, { forwardRef } from 'react';

export const HeadacheBlob = forwardRef(({ emoji }, ref) => {
  return (
    <div className="blob-stage">
      <div ref={ref} className="blob" role="img" aria-label="Headache blob">
        {emoji}
      </div>
    </div>
  );
});

HeadacheBlob.displayName = 'HeadacheBlob';
