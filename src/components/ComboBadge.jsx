import React, { forwardRef } from 'react';

export const ComboBadge = forwardRef(({ combo }, ref) => {
  return (
    <div ref={ref} className="combo-badge">
      COMBO x{combo}!
    </div>
  );
});

ComboBadge.displayName = 'ComboBadge';
