import React from 'react';
import WeekdayPartiesPage from './WeekdayPartiesPage';

const ThursdayPartiesPage: React.FC = () => (
  <WeekdayPartiesPage
    weekday={4}
    canonicalPath="/thursday-parties"
    pageTitle="מסיבות יום חמישי | Parties 24/7"
    pageDescription="כל המסיבות והרייבים החמים של יום חמישי בישראל. מצאו את הדרך לפתוח את סוף השבוע באווירה הנכונה."
    heading="מסיבות יום חמישי"
    intro="פותחים את סוף השבוע כמו שצריך? כאן תמצאו את כל המסיבות והרייבים של יום חמישי ברחבי הארץ."
  />
);

export default ThursdayPartiesPage;
